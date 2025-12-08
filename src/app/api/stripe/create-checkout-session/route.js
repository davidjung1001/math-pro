import Stripe from 'stripe';
import { supabase } from '@/lib/supabaseClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a server-side Supabase client
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY // You'll need this env var
);

export async function POST(req) {
  try {
    const { courseId } = await req.json();
    
    // Get token from Authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify the user with the token using admin client
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(JSON.stringify({ error: 'Invalid token' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const userId = user.id;
    console.log('Authenticated user:', userId);

    // Get user email
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('email')
      .eq('id', userId)
      .single();

    if (profileError || !userProfile?.email) {
      console.error('Profile error:', profileError);
      return new Response(JSON.stringify({ error: 'User email not found' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get course details
    const { data: course, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('stripe_price_id, title, price_cents')
      .eq('id', courseId)
      .single();

    if (courseError || !course?.stripe_price_id) {
      console.error('Course error:', courseError);
      return new Response(JSON.stringify({ error: 'Course not found or not configured for payments' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Creating Stripe session for course:', course.title);

    // Create Stripe Checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: course.stripe_price_id,
          quantity: 1
        }
      ],
      customer_email: userProfile.email,
      client_reference_id: userId,
      metadata: {
        user_id: userId,
        course_id: courseId,
        course_title: course.title,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/courses?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/courses?canceled=true`,
    });

    return new Response(JSON.stringify({ url: stripeSession.url }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('Checkout session error:', err);
    return new Response(JSON.stringify({ 
      error: 'Failed to create checkout session', 
      details: err.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}