<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { PUBLIC_STRIPE_KEY } from '$env/static/public';
  import type { Stripe, StripeElements } from '@stripe/stripe-js';
  
  export let amount = 0;
  export let customerEmail = '';
  export let customerName = '';
  export let orderId = null;
  
  let stripe: Stripe | null = null;
  let elements: StripeElements | null = null;
  let paymentElement: any = null; // Using any for now since PaymentElement type is not exported
  let cardElement;
  let loading = true;
  let errorMessage = '';
  let clientSecret = '';
  let paymentIntentId = '';
  let paymentElementMounted = false;
  
  const dispatch = createEventDispatcher();
  
  onMount(async () => {
    // Load Stripe.js
    const stripeJs = await import('@stripe/stripe-js');
    stripe = await stripeJs.loadStripe(PUBLIC_STRIPE_KEY);
    
    if (!stripe) {
      errorMessage = 'Failed to initialize Stripe';
      loading = false;
      return;
    }
    
    try {
      // Create a payment intent on the server
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount,
          orderId,
          customerEmail,
          customerName
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent');
      }
      
      clientSecret = data.clientSecret;
      paymentIntentId = data.paymentIntentId;
      
      // Create payment element
      elements = stripe.elements({
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#4F46E5',
            colorBackground: '#ffffff',
            colorText: '#1F2937',
            colorDanger: '#EF4444',
            fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px'
          }
        }
      });
      
      // Set flag to mount payment element after DOM is ready
      paymentElementMounted = true;
      
      // Notify parent component that payment is ready
      dispatch('ready', { paymentIntentId });
      
    } catch (error) {
      console.error('Payment initialization error:', error);
      errorMessage = error instanceof Error ? error.message : 'Failed to initialize payment';
      loading = false;
    }
  });
  
  // This function will be called after the DOM is updated
  function mountPaymentElement() {
    if (paymentElementMounted && elements && !paymentElement) {
      // Create and mount the Payment Element
      setTimeout(() => {
        try {
          if (!elements) {
            throw new Error('Elements not initialized');
          }
          paymentElement = elements.create('payment');
          paymentElement.mount('#payment-element');
          
          paymentElement.on('ready', () => {
            loading = false;
          });
          
          paymentElement.on('change', (event: { error?: { message: string } }) => {
            errorMessage = event.error ? event.error.message : '';
          });
        } catch (error) {
          console.error('Error mounting payment element:', error);
          errorMessage = 'Failed to load payment form. Please refresh the page and try again.';
          loading = false;
        }
      }, 100); // Small delay to ensure DOM is ready
    }
  }
  
  // Watch for changes to paymentElementMounted
  $: if (paymentElementMounted) {
    mountPaymentElement();
  }
  
  onDestroy(() => {
    if (paymentElement) {
      paymentElement.unmount();
    }
  });
  
  /**
   * Process the payment
   */
  export async function processPayment() {
    if (!stripe || !elements) {
      return { success: false, error: 'Payment system not initialized' };
    }
    
    loading = true;
    errorMessage = '';
    
    try {
      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: window.location.origin + '/order-confirmation',
        }
      });
      
      if (error) {
        throw new Error(error.message || 'Payment failed');
      }
      
      // Handle different payment intent statuses
      if (paymentIntent.status === 'succeeded') {
        return { 
          success: true, 
          paymentIntentId: paymentIntent.id,
          paymentMethod: paymentIntent.payment_method
        };
      } else if (paymentIntent.status === 'requires_capture') {
        // This is expected for manual capture
        return { 
          success: true, 
          paymentIntentId: paymentIntent.id,
          paymentMethod: paymentIntent.payment_method
        };
      } else {
        throw new Error(`Payment status: ${paymentIntent.status}`);
      }
    } catch (error) {
      console.error('Payment error:', error);
      errorMessage = error instanceof Error ? error.message : 'Payment failed';
      return { success: false, error: errorMessage };
    } finally {
      loading = false;
    }
  }
</script>

<div class="mt-6 space-y-4">
  <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
    <h3 class="text-lg font-medium text-gray-800 mb-4">Payment Details</h3>
    
    {#if loading}
      <div class="py-6 flex justify-center">
        <div class="animate-pulse flex space-x-4">
          <div class="flex-1 space-y-4 py-1">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded"></div>
            <div class="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    {/if}
    
    <!-- Always render the payment element container -->
    <div id="payment-element" class="mb-4"></div>
    
    {#if errorMessage}
      <div class="text-red-500 text-sm mt-2 mb-4">
        {errorMessage}
      </div>
    {/if}
    
    <div class="text-sm text-gray-500 mt-4">
      <p>Your payment is processed securely by Stripe. We do not store your card details.</p>
    </div>
  </div>
</div> 