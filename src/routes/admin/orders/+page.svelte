<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchOrders, fetchLocations, fetchServices, fetchCustomers, addOrder } from '$lib/api';
  import { orders, locations, services, customers } from '$lib/stores';
  import OrderCard from '$lib/components/OrderCard.svelte';
  
  let statusFilter = 'all';
  let locationFilter = 'all';
  let searchQuery = '';
  let showNewOrderForm = false;
  
  // New order form data
  let newOrder = {
    customer_id: '',
    location_id: '',
    service_id: '',
    weight: 0,
    notes: '',
    drop_off_date: new Date().toISOString().split('T')[0]
  };
  
  onMount(async () => {
    await Promise.all([
      fetchOrders(),
      fetchLocations(),
      fetchServices(),
      fetchCustomers()
    ]);
  });
  
  function getFilteredOrders() {
    return $orders.filter(order => {
      // Status filter
      if (statusFilter !== 'all' && order.status !== statusFilter) {
        return false;
      }
      
      // Location filter
      if (locationFilter !== 'all' && order.location_id.toString() !== locationFilter) {
        return false;
      }
      
      // Search query
      if (searchQuery) {
        const customer = order.customer;
        const searchLower = searchQuery.toLowerCase();
        const customerName = `${customer?.first_name} ${customer?.last_name}`.toLowerCase();
        const orderId = order.id.toString();
        
        if (!orderId.includes(searchLower) && !customerName.includes(searchLower)) {
          return false;
        }
      }
      
      return true;
    });
  }
  
  async function handleCreateOrder() {
    if (!newOrder.customer_id || !newOrder.location_id || !newOrder.service_id || newOrder.weight <= 0) {
      alert('Please fill in all required fields');
      return;
    }
    
    const selectedService = $services.find(s => s.id.toString() === newOrder.service_id);
    const totalPrice = selectedService ? selectedService.price * newOrder.weight : 0;
    
    const orderData = {
      customer_id: parseInt(newOrder.customer_id),
      location_id: parseInt(newOrder.location_id),
      service_id: parseInt(newOrder.service_id),
      status: 'pending' as const,
      weight: newOrder.weight,
      total_price: totalPrice,
      notes: newOrder.notes,
      drop_off_date: newOrder.drop_off_date,
      pickup_date: null
    };
    
    const result = await addOrder(orderData);
    
    if (result) {
      showNewOrderForm = false;
      // Reset form
      newOrder = {
        customer_id: '',
        location_id: '',
        service_id: '',
        weight: 0,
        notes: '',
        drop_off_date: new Date().toISOString().split('T')[0]
      };
    }
  }
</script>

<div class="bg-white rounded-lg shadow-md overflow-hidden">
  <div class="p-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Orders</h1>
      <button 
        on:click={() => showNewOrderForm = !showNewOrderForm}
        class="btn btn-primary"
      >
        {showNewOrderForm ? 'Cancel' : 'New Order'}
      </button>
    </div>
    
    {#if showNewOrderForm}
      <div class="mt-6 p-6 bg-gray-50 rounded-lg">
        <h2 class="text-lg font-medium text-gray-900">Create New Order</h2>
        
        <div class="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div class="sm:col-span-3">
            <label for="customer" class="block text-sm font-medium text-gray-700">Customer</label>
            <select 
              id="customer" 
              bind:value={newOrder.customer_id}
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="">Select a customer</option>
              {#each $customers as customer}
                <option value={customer.id}>{customer.first_name} {customer.last_name}</option>
              {/each}
            </select>
          </div>
          
          <div class="sm:col-span-3">
            <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
            <select 
              id="location" 
              bind:value={newOrder.location_id}
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="">Select a location</option>
              {#each $locations as location}
                <option value={location.id}>{location.name}</option>
              {/each}
            </select>
          </div>
          
          <div class="sm:col-span-3">
            <label for="service" class="block text-sm font-medium text-gray-700">Service</label>
            <select 
              id="service" 
              bind:value={newOrder.service_id}
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="">Select a service</option>
              {#each $services as service}
                <option value={service.id}>{service.name} (${service.price.toFixed(2)}/lb)</option>
              {/each}
            </select>
          </div>
          
          <div class="sm:col-span-3">
            <label for="weight" class="block text-sm font-medium text-gray-700">Weight (lbs)</label>
            <input 
              type="number" 
              id="weight" 
              bind:value={newOrder.weight}
              min="0.1" 
              step="0.1"
              class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          
          <div class="sm:col-span-3">
            <label for="drop-off-date" class="block text-sm font-medium text-gray-700">Drop-off Date</label>
            <input 
              type="date" 
              id="drop-off-date" 
              bind:value={newOrder.drop_off_date}
              class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          
          <div class="sm:col-span-6">
            <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
            <textarea 
              id="notes" 
              bind:value={newOrder.notes}
              rows="3" 
              class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            ></textarea>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end">
          <button 
            type="button" 
            on:click={() => showNewOrderForm = false}
            class="btn btn-secondary mr-3"
          >
            Cancel
          </button>
          <button 
            type="button" 
            on:click={handleCreateOrder}
            class="btn btn-primary"
          >
            Create Order
          </button>
        </div>
      </div>
    {/if}
    
    <div class="mt-6 flex flex-col md:flex-row gap-4">
      <div class="w-full md:w-1/3">
        <label for="status-filter" class="block text-sm font-medium text-gray-700">Filter by Status</label>
        <select 
          id="status-filter" 
          bind:value={statusFilter}
          class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="picked_up">Picked Up</option>
        </select>
      </div>
      
      <div class="w-full md:w-1/3">
        <label for="location-filter" class="block text-sm font-medium text-gray-700">Filter by Location</label>
        <select 
          id="location-filter" 
          bind:value={locationFilter}
          class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
        >
          <option value="all">All Locations</option>
          {#each $locations as location}
            <option value={location.id}>{location.name}</option>
          {/each}
        </select>
      </div>
      
      <div class="w-full md:w-1/3">
        <label for="search" class="block text-sm font-medium text-gray-700">Search</label>
        <input 
          type="text" 
          id="search" 
          bind:value={searchQuery}
          placeholder="Search by order # or customer name"
          class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>
    </div>
    
    <div class="mt-6 grid gap-6 grid-cols-1 lg:grid-cols-2">
      {#each getFilteredOrders() as order}
        <OrderCard {order} />
      {/each}
      
      {#if getFilteredOrders().length === 0}
        <div class="col-span-2 py-12 text-center text-gray-500">
          No orders found matching your filters.
        </div>
      {/if}
    </div>
  </div>
</div> 