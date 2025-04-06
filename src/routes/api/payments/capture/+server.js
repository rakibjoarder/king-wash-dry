import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { PRIVATE_STRIPE_SECRET_KEY } from '$env/static/private';

const stripe = new Stripe(PRIVATE_STRIPE_SECRET_KEY);

/**
 * POST handler for capturing a payment intent
 */
export async function POST({ request, locals }) {
  try {
    // Get the authenticated user from locals (set by hooks)
    const { user } = locals;
    if (!user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { paymentIntentId, amount } = await request.json();
    
    if (!paymentIntentId) {
      return json({ error: 'Payment intent ID is required' }, { status: 400 });
    }
    
    // Capture the payment intent
    const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId, {
      amount_to_capture: amount ? Math.round(amount * 100) : undefined // Optional: capture a different amount
    });
    
    return json({
      success: true,
      paymentIntent: {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        status: paymentIntent.status
      }
    });
  } catch (error) {
    console.error('Error capturing payment intent:', error);
    return json({ error: 'Failed to capture payment' }, { status: 500 });
  }
} 