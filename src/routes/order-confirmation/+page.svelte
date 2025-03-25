<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { services, locations } from '$lib/stores';
  import { formatCurrency } from '$lib/utils/formatting';
  
  // Get order ID from URL parameter
  const orderId = $page.url.searchParams.get('id');
  
  let order = null;
  let loading = true;
  let error = null;
  
  // Format date for display
  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
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
  
  // Fetch order details
  async function fetchOrder() {
    try {
      loading = true;
      
      if (!orderId) {
        error = 'Order ID is missing';
        loading = false;
        return;
      }
      
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching order:', fetchError);
        error = 'Failed to load order details';
      } else if (!data) {
        error = 'Order not found';
      } else {
        order = data;
        
        // Parse JSON fields
        if (order.items && typeof order.items === 'string') {
          order.items = JSON.parse(order.items);
        }
        
        if (order.preferences && typeof order.preferences === 'string') {
          order.preferences = JSON.parse(order.preferences);
        }
      }
    } catch (err) {
      console.error('Error in fetchOrder:', err);
      error = 'An unexpected error occurred';
    } finally {
      loading = false;
    }
  }
  
  onMount(fetchOrder);
</script>

<svelte:head>
  <title>Order Confirmation | King Wash & Dry</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl">
  <div class="text-center mb-8">
    <h1 class="text-3xl font-bold text-primary-600">Order Confirmation</h1>
    <p class="text-gray-600 mt-2">Thank you for your order!</p>
  </div>
  
  {#if loading}
    <div class="flex justify-center my-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  {:else if error}
    <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <h2 class="text-xl font-semibold text-red-600 mb-2">Error</h2>
      <p class="text-red-700">{error}</p>
      <a href="/" class="btn btn-primary mt-4">Return to Home</a>
    </div>
  {:else if order}
    <div class="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
      <!-- Order header -->
      <div class="bg-primary-50 p-6 border-b border-gray-200">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 class="text-2xl font-bold text-primary-700">Order #{order.id}</h2>
            <p class="text-gray-600 mt-1">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
          </div>
          <div class="mt-4 md:mt-0">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              {order.status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
      
      <!-- Order details -->
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Service details -->
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-3">Service Details</h3>
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="mb-2">
              <span class="font-medium">Service:</span> 
              {$services.find(s => s.id.toString() === order.service_id?.toString())?.name || 'N/A'}
            </p>
            <p class="mb-2">
              <span class="font-medium">Location:</span> 
              {$locations.find(l => l.id.toString() === order.location_id?.toString())?.name || 'N/A'}
            </p>
            <p class="mb-2">
              <span class="font-medium">Weight:</span> 
              {order.weight} lbs
            </p>
            {#if order.notes}
              <p class="mb-2">
                <span class="font-medium">Notes:</span> 
                {order.notes}
              </p>
            {/if}
          </div>
        </div>
        
        <!-- Schedule details -->
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-3">Schedule</h3>
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="mb-2">
              <span class="font-medium">Drop-off:</span> 
              {formatDate(order.drop_off_date)}, {getTimeSlotLabel(order.drop_off_time)}
            </p>
            {#if order.pickup_requested}
              <p class="mb-2">
                <span class="font-medium">Pick-up:</span> 
                {formatDate(order.pickup_date)}, {getTimeSlotLabel(order.pickup_time)}
              </p>
            {:else}
              <p class="mb-2">
                <span class="font-medium">Pick-up:</span> 
                Self pick-up
              </p>
            {/if}
          </div>
        </div>
        
        <!-- Customer details -->
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-3">Customer Information</h3>
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="mb-2">
              <span class="font-medium">Name:</span> 
              {order.first_name} {order.last_name}
            </p>
            <p class="mb-2">
              <span class="font-medium">Email:</span> 
              {order.email}
            </p>
            <p class="mb-2">
              <span class="font-medium">Phone:</span> 
              {order.phone}
            </p>
            {#if order.address}
              <p class="mb-2">
                <span class="font-medium">Address:</span> 
                {order.address}, {order.city}, {order.state} {order.zip}
              </p>
            {/if}
          </div>
        </div>
        
        <!-- Payment details -->
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-3">Payment Details</h3>
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="mb-2">
              <span class="font-medium">Total:</span> 
              {formatCurrency(order.total_price)}
            </p>
            {#if order.tip_amount > 0}
              <p class="mb-2">
                <span class="font-medium">Tip:</span> 
                {formatCurrency(order.tip_amount)}
              </p>
            {/if}
            {#if order.discount_amount > 0}
              <p class="mb-2">
                <span class="font-medium">Discount:</span> 
                {formatCurrency(order.discount_amount)}
              </p>
            {/if}
            {#if order.promo_code}
              <p class="mb-2">
                <span class="font-medium">Promo Code:</span> 
                {order.promo_code}
              </p>
            {/if}
            <p class="mb-2">
              <span class="font-medium">Payment Method:</span> 
              Credit Card
            </p>
          </div>
        </div>
      </div>
      
      <!-- Items -->
      {#if order.items && order.items.length > 0}
        <div class="p-6 border-t border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">Items</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {#each order.items as item}
                  {#if item.quantity > 0}
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(item.quantity * (item.avg_weight || 0.5)).toFixed(2)} lbs</td>
                    </tr>
                  {/if}
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {/if}
      
      <!-- Preferences -->
      {#if order.preferences}
        <div class="p-6 border-t border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">Laundry Preferences</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="mb-2">
                <span class="font-medium">Water Temperature:</span> 
                {order.preferences.waterTemperature === 'cold' ? 'Cold' : 'Hot'}
              </p>
              <p class="mb-2">
                <span class="font-medium">Drying Level:</span> 
                {order.preferences.dryingLevel === 'regular' ? 'Regular' : 'Delicate'}
              </p>
              <p class="mb-2">
                <span class="font-medium">Detergent:</span> 
                {order.preferences.detergent === 'scented' ? 'Scented' : 
                  order.preferences.detergent === 'unscented' ? 'Unscented' : 'Hypoallergenic'}
              </p>
            </div>
            <div>
              <p class="font-medium mb-2">Additional Services:</p>
              <ul class="list-disc pl-5">
                {#if order.preferences.additionalServices.babyCare}
                  <li>Baby Care</li>
                {/if}
                {#if order.preferences.additionalServices.bleach}
                  <li>Bleach</li>
                {/if}
                {#if order.preferences.additionalServices.darkProtect}
                  <li>Dark Protect</li>
                {/if}
                {#if order.preferences.additionalServices.fabricSoftener}
                  <li>Fabric Softener</li>
                {/if}
                {#if order.preferences.additionalServices.scentBooster}
                  <li>Scent Booster</li>
                {/if}
                {#if order.preferences.additionalServices.hangingService}
                  <li>Hanging Service</li>
                {/if}
              </ul>
            </div>
          </div>
          {#if order.preferences.specialInstructions}
            <div class="mt-4">
              <p class="font-medium mb-2">Special Instructions:</p>
              <p class="bg-gray-50 p-3 rounded">{order.preferences.specialInstructions}</p>
            </div>
          {/if}
        </div>
      {/if}
      
      <!-- Actions -->
      <div class="p-6 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center">
        <p class="text-gray-600 mb-4 sm:mb-0">
          Questions about your order? Contact us at <a href="tel:+1234567890" class="text-primary-600 hover:underline">123-456-7890</a>
        </p>
        <div class="flex space-x-4">
          <a href="/" class="btn btn-outline">Return Home</a>
          <a href="/account/orders" class="btn btn-primary">View All Orders</a>
        </div>
      </div>
    </div>
  {/if}
</div> 