import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { PRIVATE_STRIPE_SECRET_KEY } from '$env/static/private';

const stripe = new Stripe(PRIVATE_STRIPE_SECRET_KEY);

/**
 * POST handler for updating a payment intent amount
 */
export async function POST({ request, locals }) {
  try {
    // Get the authenticated user from locals (set by hooks)
    const { user } = locals;
    if (!user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { paymentIntentId, amount } = await request.json();
    
    if (!paymentIntentId || !amount || amount <= 0) {
      return json({ error: 'Invalid payment intent ID or amount' }, { status: 400 });
    }
    
    // Update the payment intent with the new amount
    const paymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
      amount: Math.round(amount * 100), // Convert to cents
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
    console.error('Error updating payment intent:', error);
    return json({ error: 'Failed to update payment intent' }, { status: 500 });
  }
} 