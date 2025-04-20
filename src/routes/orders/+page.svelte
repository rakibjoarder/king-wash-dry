<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { services, locations, currentUser } from '$lib/stores';
  import { formatCurrency } from '$lib/utils/formatting';
  import { goto } from '$app/navigation';
  // Access the user data from the server
  let data;
  
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
  
  // Fetch only the current user's orders
  async function fetchOrders(data) {
    if(!data){ 
      loading = false;
      return [];}
    try {
      loading = true;
      

      // Get customer data first
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', data.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if(!customerData){ return [];}
      // Get the user from the session data
      // Query orders only for the current user
      const { data: ordersData, error: fetchError } = await supabase
        .from('orders')
        .select(`
          *,
          service:service_id (
            id,
            name,
            description
          )
        `)
        .eq('customer_id', customerData?.id)  // Filter by the current user's ID
        .order('created_at', { ascending: false });
      
      if (fetchError) {
        throw new Error(fetchError.message);
      }
      
      // Parse JSON fields
      orders = ordersData.map(order => {
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
  
  onMount(async () => {
     // Check if user is authenticated
  const { data: session } = await supabase.auth.getSession();
  if (!session) {
    // Redirect to login page if not authenticated
    goto('/');
  }else{
    data = session?.session?.user;
    console.log("data",data);
    await fetchOrders(data);
  }
  });
</script>

<svelte:head>
  <title>Orders | King Wash & Dry</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-xl font-bold text-primary-600 mb-8">Your Orders</h1>
  
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
        <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
          <!-- Order Header with Status -->
          <div class="bg-primary-50 px-3 py-2 border-b border-primary-100">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <div class="mr-2 flex-shrink-0">
                  <div class="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center">
                    <svg class="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <div class="flex items-center">
                    <span class="font-semibold text-gray-900 text-sm">#{order.id}</span>
                    <span class="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div class="text-xs text-gray-500">{formatDate(order.created_at)}</div>
                </div>
              </div>
              <span class="font-semibold text-blue-600">{formatCurrency(order.total_price)}</span>
            </div>
          </div>
          
          <!-- Order Details in Grid Layout -->
          <div class="px-3 py-2 grid grid-cols-2 gap-4">
            <div class="flex items-center">
              <svg class="w-4 h-4 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <div>
                <div class="text-xs text-gray-500">Service</div>
                <div class="font-medium text-sm">{order.service?.name || 'N/A'}</div>
              </div>
            </div>
            
            <div class="flex items-center">
              <svg class="w-4 h-4 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              <div>
                <div class="text-xs text-gray-500">Weight</div>
               <div class="font-medium text-sm">{order.weight} lbs</div>
              </div>
            </div>
            
            <div class="flex items-start">
              <svg class="w-3.5 h-3.5 text-green-500 mr-1.5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <div class="text-xs text-gray-500">Drop-off</div>
                 <div class="font-medium text-sm">{formatDate(order.drop_off_date)}</div>
                <div class="text-xs text-gray-500">9AM - 11AM</div>
              </div>
            </div>
            
            {#if order.pickup_requested}
              <div class="flex items-start">
                <svg class="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <div>
                  <div class="text-xs text-gray-500">Pick-up</div>
                  <div class="font-medium text-sm">{formatDate(order.pickup_date)}</div>
                  <div class="text-xs text-gray-500">{order.pickup_time}</div>
                </div>
              </div>
            {:else}
              <div class="flex items-center">
                <svg class="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <div>
                  <div class="text-xs text-gray-500">Items</div>
                  <div class="font-medium">
                    {order.items && order.items.length > 0 ? order.items.filter(item => item.quantity > 0).length : 0} items
                  </div>
                </div>
              </div>
            {/if}
          </div>
          
          <!-- Order Actions - Footer -->
          <div class="bg-gray-50 px-3 py-2 border-t border-gray-100 flex justify-end items-center">
           
            <a 
              href={`/order-confirmation?id=${order.id}`} 
              class="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
            >
              View Details
            </a>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div> 
