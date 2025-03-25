<script lang="ts">
  import { services, locations } from '$lib/stores';
  import { calculateAdditionalCosts, getAdditionalServicesCostBreakdown } from '$lib/utils/pricing';
  import { onMount } from 'svelte';
  import StripePayment from './StripePayment.svelte';
  
  export let formData;
  export let preferences;
  export let selectedItems;
  export let calculateEstimatedPrice;
  export let onSubmitOrder;
  
  $: selectedService = $services.find(s => s.id.toString() === formData.service_id);
  $: selectedLocation = $locations.find(l => l.id.toString() === formData.location_id);
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
  function setTip(percentage) {
    tipPercentage = percentage;
  }
  
  // Format date for display
  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric'
    });
  }
  
  // Format time for display
  function formatTime(timeString) {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  }
  
  // Get time slot label
  function getTimeSlotLabel(timeValue) {
    const timeSlots = {
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
  function getItemIcon(iconName) {
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
  let paymentComponent;
  let isProcessingPayment = false;
  let paymentError = '';
  let paymentSuccess = false;
  let paymentIntentId = '';
  
  // Handle payment ready event
  function handlePaymentReady(event) {
    paymentIntentId = event.detail.paymentIntentId;
  }
  
  // Process payment and submit order
  async function handleSubmitOrder() {
    if (isProcessingPayment) return;
    
    isProcessingPayment = true;
    paymentError = '';
    
    try {
      // Process the payment
      const paymentResult = await paymentComponent.processPayment();
      
      if (!paymentResult.success) {
        paymentError = paymentResult.error || 'Payment failed. Please try again.';
        isProcessingPayment = false;
        return;
      }
      
      // Payment successful, now submit the order
      const orderData = {
        ...formData,
        preferences: JSON.stringify(preferences),
        items: JSON.stringify(selectedItems.filter(item => item.quantity > 0)),
        total_price: finalTotal,
        tip_amount: tipAmount,
        promo_code: promoCode || null,
        discount_amount: promoDiscount,
        payment_intent_id: paymentIntentId,
        payment_method: paymentResult.paymentMethod
      };
      
      console.log('Submitting order data:', orderData);
      
      const orderResult = await onSubmitOrder(orderData);
      console.log('Order submission result:', orderResult);
      
      if (orderResult.success) {
        paymentSuccess = true;
        
        // Check if order ID exists before redirecting (check both id and orderId)
        const orderId = orderResult.id || orderResult.orderId;
        if (orderId) {
          // Redirect to order confirmation page
          window.location.href = `/order-confirmation?id=${orderId}`;
        } else {
          // Handle missing order ID
          console.error('Order created but no ID returned');
          paymentError = 'Order was created but we could not retrieve the order ID. Please check your account for order details.';
        }
      } else {
        paymentError = orderResult.error || 'Failed to create your order. Please try again.';
      }
    } catch (error) {
      console.error('Order submission error:', error);
      paymentError = error.message || 'Failed to process your order. Please try again.';
    } finally {
      isProcessingPayment = false;
    }
  }
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
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-800">Schedule</h3>
        </div>
        
        <div class="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex">
            <div class="bg-primary-100 text-primary-700 p-3 rounded-lg mr-4 h-fit">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </div>
            <div>
              <h4 class="font-medium text-gray-800">Drop-off</h4>
              <p class="text-primary-700 font-medium mt-1">{formatDate(formData.drop_off_date)}</p>
              <p class="text-sm text-gray-600">{getTimeSlotLabel(formData.drop_off_time)}</p>
            </div>
          </div>
          
          <div class="flex">
            <div class="bg-primary-100 text-primary-700 p-3 rounded-lg mr-4 h-fit">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <h4 class="font-medium text-gray-800">Pickup</h4>
              <p class="text-primary-700 font-medium mt-1">{formatDate(formData.pickup_date)}</p>
              <p class="text-sm text-gray-600">{getTimeSlotLabel(formData.pickup_time)}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Location -->
      <div class="mb-6">
        <div class="flex items-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-800">Location</h3>
        </div>
        
        <div class="bg-gray-50 rounded-lg p-4">
          {#if selectedLocation}
            <div class="flex">
              <div class="bg-primary-100 text-primary-700 p-3 rounded-lg mr-4 h-fit">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h4 class="font-medium text-gray-800">{selectedLocation.name}</h4>
                <p class="text-sm text-gray-600">{selectedLocation.address}</p>
                <p class="text-sm text-gray-600">{selectedLocation.city}, {selectedLocation.state} {selectedLocation.zip}</p>
                <p class="text-xs text-primary-600 mt-1">Hours: {selectedLocation.hours || '9:00 AM - 7:00 PM'}</p>
              </div>
            </div>
          {:else}
            <p class="text-gray-500">No location selected</p>
          {/if}
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
            <p class="text-sm text-gray-600">{formData.phone}</p>
          </div>
          <div class="col-span-1 md:col-span-2">
            <p class="text-sm text-gray-500 mb-1">Address</p>
            <p class="font-medium text-gray-800">{formData.address}</p>
            <p class="text-sm text-gray-600">{formData.city}, {formData.state} {formData.zip}</p>
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
  customerEmail={formData.email}
  customerName={`${formData.first_name} ${formData.last_name}`}
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
    disabled={isProcessingPayment || !paymentComponent}
    class="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {#if isProcessingPayment}
      <span class="flex items-center justify-center">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Processing...
      </span>
    {:else}
      Place Order
    {/if}
  </button>
  
  <p class="text-sm text-gray-500 mt-2 text-center">
    By placing your order, you agree to our Terms of Service and Privacy Policy
  </p>
</div> 