import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

export async function POST(req) {
  const rawBody = await req.text();
  const sig = req.headers.get('stripe-signature');
  const buf = Buffer.from(rawBody, 'utf8');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
  
  console.log(`[Stripe Webhook] Received event type: ${event.type}`);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      
      console.log('[Checkout Session]', session);

      // Handle one-time course purchases (mode: 'payment')
      if (session.mode === 'payment') {
        const { user_id, course_id, course_title } = session.metadata;
        const amount = session.amount_total; // in cents
        const paymentIntentId = session.payment_intent;

        console.log(`[Course Purchase] User: ${user_id}, Course: ${course_id}, Amount: $${amount/100}`);

        if (!user_id || !course_id) {
          console.error('❌ Missing user_id or course_id in metadata');
          break;
        }

        try {
          // 1. Create course purchase record
          const { data: purchase, error: purchaseError } = await supabase
            .from('course_purchases')
            .insert({
              user_id,
              course_id,
              amount_cents: amount,
              stripe_checkout_session_id: session.id,
              stripe_payment_intent_id: paymentIntentId,
              status: 'completed',
            })
            .select()
            .single();

          if (purchaseError) {
            console.error('❌ Error creating purchase:', purchaseError);
            throw purchaseError;
          }

          console.log('✅ Purchase record created:', purchase.id);

          // 2. Create enrollment
          const { error: enrollmentError } = await supabase
            .from('user_enrollments')
            .insert({
              user_id,
              course_id,
              purchase_id: purchase.id,
              enrollment_type: 'purchased',
            });

          if (enrollmentError) {
            console.error('❌ Error creating enrollment:', enrollmentError);
            throw enrollmentError;
          }

          console.log('✅ Enrollment created for user:', user_id);

        } catch (error) {
          console.error('❌ Error processing course purchase:', error);
          return new Response('Webhook handler failed', { status: 500 });
        }
      }
      
      // Handle subscription purchases (keep your existing logic)
      if (session.mode === 'subscription' && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription, {
          expand: ['items.data.price'],
        });
        
        const userId = session.client_reference_id || session.metadata?.user_id;
        
        console.log(`[Subscription Purchase] User: ${userId}, Status: ${subscription.status}`);

        if (!userId) {
          console.error('❌ Missing user_id for subscription');
          break;
        }

        // Update user_subscriptions
        const { error: subError } = await supabase
          .from('user_subscriptions')
          .upsert({ 
            user_id: userId,
            plan: 'premium',
            status: subscription.status
          }, { onConflict: 'user_id' });
          
        if (subError) {
          console.error('❌ Subscription update error:', subError);
        } else {
          console.log('✅ Subscription updated');
        }
        
        // Update user_profiles
        const { error: profileError } = await supabase
          .from('user_profiles')
          .update({ plan: 'premium' })
          .eq('id', userId);
        
        if (profileError) {
          console.error('❌ Profile update error:', profileError);
        } else {
          console.log('✅ User profile updated to premium');
        }
      }
      break;
    }

    case 'customer.subscription.updated': 
    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      
      if (!sub.id) break;
      
      console.log(`[Subscription ${event.type}] Sub ID: ${sub.id}, Status: ${sub.status}`);
      
      let planName = sub.status === 'active' || sub.status === 'trialing' ? 'premium' : 'free';

      // Update user_subscriptions
      const { error: subError, data: subData } = await supabase
        .from('user_subscriptions')
        .update({ 
          plan: planName,
          status: sub.status
        }) 
        .eq('stripe_subscription_id', sub.id)
        .select('user_id')
        .single();
        
      if (subError) {
        console.error('❌ Subscription update error:', subError);
        break;
      }

      // Update user_profiles
      if (subData?.user_id) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .update({ plan: planName })
          .eq('id', subData.user_id);
        
        if (profileError) {
          console.error('❌ Profile update error:', profileError);
        } else {
          console.log('✅ User profile updated to', planName);
        }
      }
      
      break;
    }
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}