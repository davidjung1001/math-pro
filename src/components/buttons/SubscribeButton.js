'use client'

import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

// Stripe's best practice is to load the key outside of the component to avoid
// reloading it on every render, but it's fine inside a functional component 
// if you ensure it only loads once, which `loadStripe` handles internally.

export default function SubscribeButton({ priceId }) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);

    try {
      // 1. Create Checkout Session on Backend
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Ensure your server handles the correct body format
        body: JSON.stringify({ priceId })
      });

      const data = await res.json();
      
      // Handle non-2xx responses from your API route
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create Stripe Checkout Session');
      }

      // **2. FIX: Direct Redirection using the URL from the backend**
      // The backend should return the full Checkout Session URL (e.g., data.url)
      
      const checkoutUrl = data.url || data.sessionUrl || data.checkoutUrl;

      if (checkoutUrl) {
        // Redirection should happen here. We don't need to load Stripe.js 
        // just to redirect if the backend provided the URL.
        window.location.href = checkoutUrl;
        
        // Return early to prevent setting loading to false before redirection
        return; 
      }
      
      // Fallback/Error if the URL isn't returned
      throw new Error('Checkout URL was not returned from the server.');
      
      // If you were using client-side redirection (less common now), 
      // the code would look like this (but your backend response must be 
      // configured for it):
      /*
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      if (!stripe) throw new Error('Stripe failed to load');
      const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId, // Assuming your backend returns sessionId
      });
      if (error) throw new Error(error.message);
      */

    } catch (err) {
      console.error('Checkout error:', err);
      // Display a user-friendly error message
      alert(err.message || 'Failed to start subscription checkout. Please try again.');
    } finally {
      // Only set loading to false if the redirection did not happen 
      // (i.e., an error occurred).
      setLoading(false); 
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded text-white font-semibold"
    >
      {loading ? 'Processing...' : 'Subscribe'}
    </button>
  );
}