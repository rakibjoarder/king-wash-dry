<script lang="ts">
  import { services } from '$lib/stores';
  import { calculateAdditionalCosts, getAdditionalServicesCostBreakdown } from '$lib/utils/pricing';
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { currentUser } from '$lib/stores';
  import StripePayment from './StripePayment.svelte';
  
  interface CustomerData {
    id: number;
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  }

  interface PaymentComponent {
    processPayment: () => Promise<{ success: boolean; error?: string; paymentMethod?: string }>;
  }

  interface PaymentReadyEvent {
    detail: {
      paymentIntentId: string;
    };
  }

  export let formData: any;
  export let preferences: any;
  export let selectedItems: any[];
  export let calculateEstimatedPrice: () => number;
  export let onSubmitOrder: (data: any) => Promise<any>;
  
  let customerData: CustomerData | null = null;
  let loading = true;
  let paymentComponent: PaymentComponent;
  
  onMount(async () => {
    try {
      // Get current user's session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Fetch customer data
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error fetching customer:', error);
        } else if (data) {
          customerData = data;
          // Pre-fill form data with customer information
          formData = {
            ...formData,
            first_name: data.first_name || formData.first_name,
            last_name: data.last_name || formData.last_name,
            email: data.email || formData.email,
            phone: data.phone || formData.phone,
            address: data.address || formData.address,
            city: data.city || formData.city,
            state: data.state || formData.state,
            zip: data.zip || formData.zip
          };
        }
      }
    } catch (err) {
      console.error('Error loading customer data:', err);
    } finally {
      loading = false;
    }
  });
  
  $: selectedService = $services.find(s => s.id.toString() === formData.service_id);
  $: totalPrice = calculateEstimatedPrice();
  
  $: console.log('selectedService', selectedService);
  
  // Calculate base price (flat service fee)
  $: basePrice = selectedService?.price || 0;
  
  // Calculate weight cost (price per pound * weight)
  // Note: price_per_pound is actually stored in the price field
  $: weightCost = formData.weight * (selectedService?.price || 0);
  
  // Calculate subtotal (base price + weight cost)
  $: subtotal = weightCost;
  
  // Calculate additional services cost using the shared utility function
  $: additionalServicesCost = calculateAdditionalCosts(preferences, formData.weight);
  
  // Get detailed breakdown of additional services
  $: additionalServiceBreakdown = getAdditionalServicesCostBreakdown(preferences, formData.weight);
  
  // Promo code and discount
  let promoCode = '';
  let promoDiscount = 0;
  let promoError = '';
  let promoSuccess = '';
  let availablePromoCodes = [];
  
  // Tips
  let tipPercentage = 0;
  let tipAmount = 0;
  const tipOptions = [0, 10, 15, 20, 25];
  
  // Calculate tip amount based on percentage
  $: tipAmount = (subtotal + additionalServicesCost) * (tipPercentage / 100);
  
  // Calculate final total with tip and promo discount
  $: finalTotal = totalPrice + tipAmount - promoDiscount;
  
  // Calculate order subtotal (before promo and tip)
  $: orderSubtotal = subtotal + additionalServicesCost;
  
  // Fetch available promo codes on mount
  onMount(async () => {
    try {
      const response = await fetch('/api/promo-codes');
      if (response.ok) {
        availablePromoCodes = await response.json();
      }
    } catch (error) {
      console.error('Error fetching promo codes:', error);
    }
  });
  
  // Apply promo code
  async function applyPromoCode() {
    if (!promoCode.trim()) {
      promoError = 'Please enter a promo code';
      promoSuccess = '';
      return;
    }
    
    // Reset messages
    promoError = '';
    promoSuccess = '';
    promoDiscount = 0;
    
    try {
      const response = await fetch('/api/promo-codes/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: promoCode,
          orderAmount: orderSubtotal
        })
      });
      
      const result = await response.json();
      
      if (!result.valid) {
        promoError = result.message || 'Invalid promo code';
        return;
      }
      
      // Apply the discount
      promoDiscount = result.promoCode.discountAmount;
      
      // Format success message
      if (result.promoCode.discount_type === 'percentage') {
        promoSuccess = `${result.promoCode.discount_value}% discount applied!`;
      } else {
        promoSuccess = `$${result.promoCode.discount_value.toFixed(2)} discount applied!`;
      }
      
    } catch (error) {
      console.error('Error applying promo code:', error);
      promoError = 'Failed to apply promo code. Please try again.';
    }
  }
  
  // Set tip percentage
  function setTip(percentage: number): void {
    tipPercentage = percentage;
  }
  
  // Format date for display
  function formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric'
    });
  }
  
  // Format time for display
  function formatTime(timeString: string): string {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  }
  
  // Get time slot label
  function getTimeSlotLabel(timeValue: string): string {
    const timeSlots: Record<string, string> = {
      '08:00': '8:00 AM - 10:00 AM',
      '10:00': '10:00 AM - 12:00 PM',
      '12:00': '12:00 PM - 2:00 PM',
      '14:00': '2:00 PM - 4:00 PM',
      '16:00': '4:00 PM - 6:00 PM',
      '18:00': '6:00 PM - 8:00 PM'
    };
    return timeSlots[timeValue] || timeValue;
  }
  
  // Helper function to get item icons
  function getItemIcon(iconName: string): string {
    switch (iconName) {
      case 'shirt':
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 2L2 6v14a2 2 0 002 2h16a2 2 0 002-2V6l-4-4M3 6l5 .5M21 6l-5 .5M12 6v12M8 12h8" />
        </svg>`;
      case 'pants':
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v18m6-18v18M3 3h18M3 21h18" />
        </svg>`;
      case 'dress':
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v20M7 4h10l-2 6h-6l-2-6zM5 14h14" />
        </svg>`;
      case 'sweater':
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3-3h12l3 3M3 6v14a2 2 0 002 2h14a2 2 0 002-2V6M8 12h8" />
        </svg>`;
      case 'jacket':
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3-3h12l3 3M3 6v14a2 2 0 002 2h14a2 2 0 002-2V6M6 18h12M6 14h12M6 10h12" />
        </svg>`;
      case 'bedding':
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>`;
      case 'towel':
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h18v6H3V3zM3 12h18v2H3v-2zM3 17h18v4H3v-4z" />
        </svg>`;
      case 'underwear':
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3c-1.2 0-2.4.6-3 1.5-.6-.9-1.8-1.5-3-1.5-2 0-3.5 1.6-3.5 3.5 0 1.4.5 2.5 1.5 3.5l8 8 8-8c1-1 1.5-2.1 1.5-3.5C21.5 4.6 20 3 18 3c-1.2 0-2.4.6-3 1.5-.6-.9-1.8-1.5-3-1.5z" />
        </svg>`;
      case 'child':
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>`;
      default:
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>`;
    }
  }
  
  // Payment state
  let isProcessingPayment = false;
  let paymentError = '';
  let paymentSuccess = false;
  let paymentIntentId = '';
  
  // Handle payment ready event
  function handlePaymentReady(event: PaymentReadyEvent): void {
    paymentIntentId = event.detail.paymentIntentId;
  }

  // Function to update payment intent amount
  async function updatePaymentIntent() {
    if (!paymentIntentId) return;
    
    try {
      // Get current user's session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('No authenticated session found');
      }

      const response = await fetch('/api/payments/update-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          paymentIntentId,
          amount: finalTotal
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update payment intent');
      }
    } catch (error) {
      console.error('Error updating payment intent:', error);
    }
  }

  // Watch for changes in finalTotal and update payment intent
  $: if (paymentIntentId && finalTotal > 0) {
    updatePaymentIntent();
  }
  
  // Process payment and submit order
  async function handleSubmitOrder(): Promise<void> {
    if (isProcessingPayment) return;
    
    isProcessingPayment = true;
    paymentError = '';
    
    try {
      // Get current user's session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        paymentError = 'Failed to get user session';
        isProcessingPayment = false;
        return;
      }
      
      if (!session?.user) {
        paymentError = 'You must be logged in to place an order';
        isProcessingPayment = false;
        return;
      }

      console.log('User session:', session.user);

      // Get customer ID
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      console.log('Customer data:', customerData);
      console.log('Customer error:', customerError);

      if (customerError || !customerData) {
        console.error('Customer error:', customerError);
        paymentError = 'Failed to retrieve customer information';
        isProcessingPayment = false;
        return;
      }
      
      // Process the payment
      const paymentResult = await paymentComponent.processPayment();
      
      if (!paymentResult.success) {
        paymentError = paymentResult.error || 'Payment failed. Please try again.';
        isProcessingPayment = false;
        return;
      }
      console.log('Payment result:', paymentResult);
      
      // Payment successful, now submit the order
      const orderData = {
        // Customer information
        customer_id: customerData.id,
        first_name: customerData.first_name,
        last_name: customerData.last_name,
        email: customerData.email,
        phone: customerData.phone,
        
        // Order details
        service_id: parseInt(formData.service_id),
        location_id: 1, // Default location ID
        weight: formData.weight,
        total_price: finalTotal,
        
        // Scheduling
        drop_off_date: formData.drop_off_date,
        drop_off_time: formData.drop_off_time,
        pickup_date: formData.pickup_date,
        pickup_time: formData.pickup_time,
        
        // Address information
        address: formData.pickup_address,
        city: formData.pickup_city,
        state: 'USA', // Default state
        zip: formData.pickup_zip,
        
        // Additional data
        preferences: JSON.stringify(preferences),
        items: JSON.stringify(selectedItems.filter(item => item.quantity > 0)),
        delivery_instructions: formData.delivery_instructions,
        
        // Payment information
        payment_intent_id: paymentIntentId,
        payment_method: paymentResult.paymentMethod,

        // Additional amounts
        tip_amount: tipAmount,
        promo_code: promoCode || null,
        discount_amount: promoDiscount
      };
      
      console.log('Submitting order data:', orderData);
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create order');
      }
      
      paymentSuccess = true;
      
      // Check if order ID exists before redirecting
      const orderId = result.id || result.orderId;
      if (orderId) {
        // Redirect to order confirmation page
        window.location.href = `/order-confirmation?id=${orderId}`;
      } else {
        // Handle missing order ID
        console.error('Order created but no ID returned');
        paymentError = 'Order was created but we could not retrieve the order ID. Please check your account for order details.';
      }
    } catch (error: unknown) {
      console.error('Order submission error:', error);
      if (error instanceof Error) {
        paymentError = error.message;
      } else {
        paymentError = 'Failed to process your order. Please try again.';
      }
    } finally {
      isProcessingPayment = false;
    }
  }

  let phoneError = '';
  let isUpdatingPhone = false;
  let tempPhone = ''; // Temporary phone number storage
  let isEditingPhone = false;

  function formatPhoneNumber(value: string) {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    if (phoneNumber.length < 4) return `(${phoneNumber}`;
    if (phoneNumber.length < 7) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  }

  function handlePhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const numbers = value.replace(/[^\d]/g, '');
    
    if (numbers.length <= 10) {
      tempPhone = formatPhoneNumber(value);
    }
  }

  async function updatePhoneNumber() {
    if (!tempPhone || !tempPhone.match(/^\(\d{3}\) \d{3}-\d{4}$/)) {
      phoneError = 'Please enter a valid phone number in the format (555) 555-5555';
      return;
    }

    isUpdatingPhone = true;
    phoneError = '';

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        phoneError = 'You must be logged in to update your phone number';
        return;
      }

      const { error } = await supabase
        .from('customers')
        .update({ phone: tempPhone })
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error updating phone number:', error);
        phoneError = 'Failed to update phone number. Please try again.';
      } else {
        formData.phone = tempPhone; // Only update formData after successful save
        isEditingPhone = false; // Exit edit mode after successful save
      }
    } catch (err) {
      console.error('Error updating phone number:', err);
      phoneError = 'An unexpected error occurred. Please try again.';
    } finally {
      isUpdatingPhone = false;
    }
  }

  // Disable the Place Order button if phone number is missing
  $: canPlaceOrder = formData.phone && !isProcessingPayment && paymentComponent;

  // Add reactive statement for customer name and email
  $: customerName = customerData ? `${customerData.first_name} ${customerData.last_name}` : '';
  $: customerEmail = customerData?.email || $currentUser?.email || '';
</script>

<div class="space-y-6">
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="bg-primary-600 text-white p-4">
      <h2 class="text-xl font-semibold">Order Summary</h2>
      <p class="text-primary-100">Please review your order details before confirming</p>
    </div>
    
    <div class="p-5">
      <!-- Service Information -->
      <div class="mb-6">
        <div class="flex items-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 class="text-lg font-medium text-gray-800">Service</h3>
        </div>
        
        <div class="bg-gray-50 rounded-lg p-4 flex items-center">
          {#if selectedService}
            <div class="bg-primary-100 text-primary-700 p-3 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <div>
              <h4 class="font-medium text-gray-800">{selectedService.name}</h4>
              <p class="text-sm text-gray-600">{selectedService.description}</p>
              <p class="text-sm text-primary-600 mt-1">${selectedService.price ? selectedService.price.toFixed(2) : '0.00'} base price</p>
            </div>
          {:else}
            <p class="text-gray-500">No service selected</p>
          {/if}
        </div>
      </div>
      
      <!-- Items -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 class="text-lg font-medium text-gray-800">Items</h3>
          </div>
          <span class="text-sm font-medium bg-primary-50 text-primary-700 py-1 px-2 rounded-full">
            Weight: {formData.weight} lbs
          </span>
        </div>
        
        <div class="bg-gray-50 rounded-lg p-4">
          {#if selectedItems.some(item => item.quantity > 0)}
            <div class="divide-y divide-gray-200">
              {#each selectedItems.filter(item => item.quantity > 0) as item}
                <div class="py-3 flex justify-between items-center">
                  <div class="flex items-center">
                    <div class="w-8 h-8 flex items-center justify-center bg-primary-100 text-primary-700 rounded-full mr-3">
                      {@html item.icon ? getItemIcon(item.icon) : '<span>' + item.name.charAt(0) + '</span>'}
                    </div>
                    <span class="text-gray-800">{item.name}</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-gray-600 mr-2">x{item.quantity}</span>
                    <span class="text-xs bg-gray-200 text-gray-700 py-1 px-2 rounded-full">
                      {(item.quantity * (item.avg_weight || 0.5)).toFixed(1)} lbs
                    </span>
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <p class="text-gray-500 text-center py-2">No items added</p>
          {/if}
        </div>
      </div>
      
      <!-- Preferences -->
      <div class="mb-6">
        <div class="flex items-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-800">Laundry Preferences</h3>
        </div>
        
        <div class="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500 mb-1">Water Temperature</p>
            <p class="font-medium text-gray-800">{preferences.waterTemperature}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">Drying Level</p>
            <p class="font-medium text-gray-800">{preferences.dryingLevel}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">Detergent</p>
            <p class="font-medium text-gray-800">{preferences.detergent}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">Additional Services</p>
            <div class="flex flex-wrap gap-2 mt-1">
              {#each Object.entries(preferences.additionalServices) as [service, enabled]}
                {#if enabled}
                  <span class="text-xs bg-primary-100 text-primary-700 py-1 px-2 rounded-full">
                    {service.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                {/if}
              {/each}
            </div>
          </div>
          
          {#if preferences.specialInstructions}
            <div class="col-span-1 md:col-span-2">
              <p class="text-sm text-gray-500 mb-1">Special Instructions</p>
              <p class="text-gray-800 text-sm bg-white p-2 rounded border border-gray-200">{preferences.specialInstructions}</p>
            </div>
          {/if}
        </div>
      </div>
      
      <!-- Schedule -->
      <div class="mb-6">
        <div class="flex items-center mb-3">
          <div class="bg-blue-50 p-2 rounded-lg mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900">Schedule</h3>
        </div>

        <!-- Service Promise Banner -->
        <div class="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 mb-4">
          <div class="flex items-start space-x-3">
            <div class="bg-white p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h4 class="text-primary-800 font-medium mb-1">Our Service Promise</h4>
              <p class="text-sm text-gray-600 leading-relaxed">
                We'll send you a confirmation call before pickup and delivery. Our professional team will handle your laundry with care, and you'll receive updates throughout the process.
              </p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm border border-gray-100">
          <div class="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <!-- Pickup Details -->
            <div class="p-4">
              <div class="flex items-center mb-3">
                <div class="bg-blue-50 p-1.5 rounded-lg mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900">Pickup</h4>
                  <p class="text-xs text-blue-600">We'll call to confirm 30 mins before arrival</p>
                </div>
              </div>
              <div class="space-y-3 ml-7">
                <div class="flex items-center text-sm">
                  <svg class="h-4 w-4 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="text-blue-600 font-medium">{formatDate(formData.pickup_date)}</span>
                  <span class="mx-2 text-gray-400">|</span>
                  <span class="text-gray-600">{formData.pickup_time}</span>
                </div>
                <div class="text-sm text-gray-600 flex">
                  <svg class="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <div>
                    <p class="font-medium">{formData.pickup_address}</p>
                    <p class="text-gray-500">{formData.pickup_city}, {formData.pickup_zip}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Delivery Details -->
            <div class="p-4">
              <div class="flex items-center mb-3">
                <div class="bg-green-50 p-1.5 rounded-lg mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900">Delivery</h4>
                  <p class="text-xs text-green-600">Fresh and clean, right to your door</p>
                </div>
              </div>
              <div class="space-y-3 ml-7">
                <div class="flex items-center text-sm">
                  <svg class="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="text-green-600 font-medium">{formatDate(formData.drop_off_date)}</span>
                  <span class="mx-2 text-gray-400">|</span>
                  <span class="text-gray-600">{formData.drop_off_time}</span>
                </div>
                <div class="text-sm text-gray-600 flex">
                  <svg class="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <div>
                    <p class="font-medium">{formData.dropoff_address}</p>
                    <p class="text-gray-500">{formData.dropoff_city}, {formData.dropoff_zip}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Delivery Instructions if any -->
          {#if formData.delivery_instructions}
            <div class="border-t border-gray-100 p-4">
              <div class="flex items-start space-x-3">
                <div class="bg-yellow-50 p-1.5 rounded-lg">
                  <svg class="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Special Instructions</p>
                  <p class="text-sm text-gray-600">{formData.delivery_instructions}</p>
                </div>
              </div>
            </div>
          {/if}

          <!-- Service Steps -->
          <div class="border-t border-gray-100 p-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="flex items-start space-x-3">
                <div class="bg-blue-50 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Confirmation Call</p>
                  <p class="text-xs text-gray-500">We'll call 30 mins before arrival</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="bg-primary-50 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Status Updates</p>
                  <p class="text-xs text-gray-500">Track your order progress</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="bg-green-50 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Quality Check</p>
                  <p class="text-xs text-gray-500">100% satisfaction guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Customer Information -->
      <div class="mb-6">
        <div class="flex items-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-800">Customer Information</h3>
        </div>
        
        <div class="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500 mb-1">Name</p>
            <p class="font-medium text-gray-800">{formData.first_name} {formData.last_name}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">Contact</p>
            <p class="font-medium text-gray-800">{formData.email}</p>
            {#if !formData.phone || isEditingPhone}
              <div class="mt-2">
                <label for="phone" class="block text-sm text-gray-600 mb-1">Phone Number (required)</label>
                <div class="flex items-center space-x-2">
                  <input
                    type="tel"
                    id="phone"
                    bind:value={tempPhone}
                    on:input={handlePhoneInput}
                    placeholder="(555) 555-5555"
                    class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    on:click={updatePhoneNumber}
                    disabled={!tempPhone || !tempPhone.match(/^\(\d{3}\) \d{3}-\d{4}$/)}
                    class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save
                  </button>
                </div>
                {#if phoneError}
                  <p class="text-red-500 text-xs mt-1">{phoneError}</p>
                {/if}
              </div>
            {:else}
              <div class="flex items-center space-x-2">
                <p class="text-sm text-gray-600">{formData.phone}</p>
                <button
                  on:click={() => {
                    isEditingPhone = true;
                    tempPhone = formData.phone;
                  }}
                  class="text-primary-600 hover:text-primary-700 text-sm font-medium focus:outline-none"
                >
                  Edit
                </button>
              </div>
            {/if}
          </div>
          
          {#if formData.notes}
            <div class="col-span-1 md:col-span-2">
              <p class="text-sm text-gray-500 mb-1">Additional Notes</p>
              <p class="text-gray-800 text-sm bg-white p-2 rounded border border-gray-200">{formData.notes}</p>
            </div>
          {/if}
        </div>
      </div>
      
      <!-- Price Summary -->
      <div class="mt-8 bg-primary-50 rounded-lg p-4">
        <h3 class="text-lg font-medium text-gray-800 mb-3">Price Summary</h3>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-600">Subtotal (${selectedService?.price?.toFixed(2) || '0.00'}/lb * {formData.weight} lbs)</span>
            <span class="font-medium">${weightCost.toFixed(2)}</span>
          </div>
          
          <!-- Additional services with detailed breakdown -->
          {#if additionalServiceBreakdown.length > 0}
            <div>
              <div class="flex justify-between">
                <span class="text-gray-600">Additional Services</span>
                <span class="font-medium">${additionalServicesCost.toFixed(2)}</span>
              </div>
              
              <!-- Detailed breakdown -->
              <div class="ml-4 mt-1 text-sm">
                {#each additionalServiceBreakdown as service}
                  <div class="flex justify-between text-gray-500">
                    <span>- {service.name}</span>
                    <span>${service.cost.toFixed(2)}</span>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
          
          <!-- Promo Code Section -->
          <div class="mt-4 pt-3 border-t border-gray-200">
            <div class="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span class="font-medium text-gray-700">Promo Code</span>
            </div>
            
            <div class="flex">
              <input 
                type="text" 
                bind:value={promoCode}
                placeholder="Enter promo code" 
                class="flex-grow border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button 
                on:click={applyPromoCode}
                class="bg-primary-600 text-white px-4 py-2 rounded-r-lg text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                Apply
              </button>
            </div>
            
            {#if promoError}
              <p class="text-red-500 text-xs mt-1">{promoError}</p>
            {/if}
            
            {#if promoSuccess}
              <p class="text-green-600 text-xs mt-1">{promoSuccess}</p>
            {/if}
            
            {#if promoDiscount > 0}
              <div class="flex justify-between mt-2 text-green-600">
                <span>Discount</span>
                <span>-${promoDiscount.toFixed(2)}</span>
              </div>
            {/if}
          </div>
          
          <!-- Tip Section -->
          <div class="mt-4 pt-3 border-t border-gray-200">
            <div class="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="font-medium text-gray-700">Add Tip</span>
            </div>
            
            <div class="flex space-x-2">
              {#each tipOptions as percentage}
                <button 
                  class="flex-1 py-2 px-1 text-sm rounded-lg border {tipPercentage === percentage ? 'bg-primary-100 border-primary-500 text-primary-700' : 'border-gray-300 hover:border-gray-400'}"
                  on:click={() => setTip(percentage)}
                >
                  {percentage}%
                </button>
              {/each}
            </div>
            
            {#if tipAmount > 0}
              <div class="flex justify-between mt-2 text-gray-600">
                <span>Tip ({tipPercentage}%)</span>
                <span>${tipAmount.toFixed(2)}</span>
              </div>
            {/if}
          </div>
          
          <div class="border-t border-gray-300 my-2 pt-2 flex justify-between">
            <span class="font-medium text-gray-800">Total</span>
            <span class="font-bold text-primary-700 text-xl">${finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Add the payment component after the price summary -->
<StripePayment 
  bind:this={paymentComponent}
  amount={finalTotal}
  customerEmail={customerEmail}
  customerName={customerName}
  on:ready={handlePaymentReady}
/>

<!-- Place Order Button -->
<div class="mt-8">
  {#if paymentError}
    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
      <p>{paymentError}</p>
    </div>
  {/if}
  
  <button 
    on:click={handleSubmitOrder}
    disabled={!canPlaceOrder || isUpdatingPhone}
    class="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {#if isProcessingPayment || isUpdatingPhone}
      <span class="flex items-center justify-center">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {isUpdatingPhone ? 'Updating Phone...' : 'Processing...'}
      </span>
    {:else if !formData.phone}
      Add Phone Number to Continue
    {:else}
      Place Order
    {/if}
  </button>
  
  <p class="text-sm text-gray-500 mt-2 text-center">
    By placing your order, you agree to our Terms of Service and Privacy Policy
  </p>
</div> 