import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { PRIVATE_STRIPE_SECRET_KEY } from '$env/static/private';

const stripe = new Stripe(PRIVATE_STRIPE_SECRET_KEY);

/**
 * POST handler for creating a payment intent
 */
export async function POST({ request }) {
  try {
    const { amount, orderId, customerEmail, customerName } = await request.json();
    
    if (!amount || amount <= 0) {
      return json({ error: 'Invalid payment amount' }, { status: 400 });
    }
    
    // Create a payment intent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: orderId || 'pending',
      },
      receipt_email: customerEmail,
      description: `Order payment for ${customerName || 'customer'}`,
      capture_method: 'manual', // Only authorize, don't capture yet
      automatic_payment_methods: {
        enabled: true,
      },
    });
    
    return json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return json({ error: 'Failed to create payment intent' }, { status: 500 });
  }
} 