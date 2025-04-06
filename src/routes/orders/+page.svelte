<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { services, locations } from '$lib/stores';
  import { formatCurrency } from '$lib/utils/formatting';
  
  let orders = [];
  let loading = true;
  let error = null;
  
  // Format date for display
  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
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
  
  // Get status badge color
  function getStatusColor(status) {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  
  // Fetch all orders
  async function fetchOrders() {
    try {
      loading = true;
      
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select(`
          *,
          service:service_id (
            id,
            name,
            description
          )
        `)
        .order('created_at', { ascending: false });
      
      if (fetchError) {
        throw new Error(fetchError.message);
      }
      
      // Parse JSON fields
      orders = data.map(order => {
        if (order.items && typeof order.items === 'string') {
          order.items = JSON.parse(order.items);
        }
        if (order.preferences && typeof order.preferences === 'string') {
          order.preferences = JSON.parse(order.preferences);
        }
        return order;
      });
      
    } catch (err) {
      console.error('Error fetching orders:', err);
      error = err.message || 'Failed to load orders';
    } finally {
      loading = false;
    }
  }
  
  onMount(fetchOrders);
</script>

<svelte:head>
  <title>Orders | King Wash & Dry</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-3xl font-bold text-primary-600">Your Orders</h1>
    <a href="/order" class="btn btn-primary px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700">
      New Order
    </a>
  </div>
  
  {#if loading}
    <div class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  {:else if error}
    <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <h2 class="text-xl font-semibold text-red-600 mb-2">Error</h2>
      <p class="text-red-700">{error}</p>
      <button 
        class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        on:click={fetchOrders}
      >
        Try Again
      </button>
    </div>
  {:else if orders.length === 0}
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
      <h2 class="text-xl font-semibold text-gray-700 mb-2">No Orders Yet</h2>
      <p class="text-gray-600 mb-6">You haven't placed any orders yet. Start by creating a new order.</p>
      <a href="/order" class="btn btn-primary px-6 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700">
        Place Your First Order
      </a>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each orders as order}
        <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
          <!-- Order Header -->
          <div class="bg-primary-50 p-4 border-b border-gray-200">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-bold text-primary-700">Order #{order.id}</h3>
                <p class="text-sm text-gray-600">{formatDate(order.created_at)}</p>
              </div>
              <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
          
          <!-- Order Details -->
          <div class="p-4">
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Service:</span>
                <span class="font-medium">{order.service?.name || 'N/A'}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Location:</span>
                <span class="font-medium">{order.location?.name || 'N/A'}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Weight:</span>
                <span class="font-medium">{order.weight} lbs</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Total:</span>
                <span class="font-bold text-primary-700">{formatCurrency(order.total_price)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Drop-off:</span>
                <span class="font-medium">{formatDate(order.drop_off_date)}</span>
              </div>
              {#if order.pickup_requested}
                <div class="flex justify-between">
                  <span class="text-gray-600">Pick-up:</span>
                  <span class="font-medium">{formatDate(order.pickup_date)}</span>
                </div>
              {/if}
            </div>
            
            <!-- Items Summary (if available) -->
            {#if order.items && order.items.length > 0}
              <div class="mt-4 pt-4 border-t border-gray-200">
                <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Items</h4>
                <div class="text-sm text-gray-600">
                  {order.items.filter(item => item.quantity > 0).length} different item types
                </div>
              </div>
            {/if}
          </div>
          
          <!-- Order Actions -->
          <div class="bg-gray-50 p-4 border-t border-gray-200">
            <div class="flex justify-center">
              <a href={`/order-confirmation?id=${order.id}`} class="text-primary-600 hover:text-primary-800 text-sm font-medium">
                View Details
              </a>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div> 