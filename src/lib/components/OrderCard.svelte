<script lang="ts">
  import type { Order } from '$lib/types';
  import { updateOrderStatus } from '$lib/api';
  
  export let order: Order;
  
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    picked_up: 'bg-gray-100 text-gray-800'
  };
  
  async function handleStatusChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const newStatus = select.value as Order['status'];
    await updateOrderStatus(order.id, newStatus);
  }
</script>

<div class="bg-white rounded-lg shadow-md overflow-hidden">
  <div class="p-6">
    <div class="flex justify-between items-start">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
        <p class="mt-1 text-gray-600">
          {order.customer?.first_name} {order.customer?.last_name} • {order.customer?.phone}
        </p>
      </div>
      <span class={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
        {order.status.replace('_', ' ')}
      </span>
    </div>
    
    <div class="mt-4 grid grid-cols-2 gap-4">
      <div>
        <p class="text-sm text-gray-500">Location</p>
        <p class="text-gray-700">{order.location?.name}</p>
      </div>
      <div>
        <p class="text-sm text-gray-500">Service</p>
        <p class="text-gray-700">{order.service?.name}</p>
      </div>
      <div>
        <p class="text-sm text-gray-500">Weight</p>
        <p class="text-gray-700">{order.weight} lbs</p>
      </div>
      <div>
        <p class="text-sm text-gray-500">Total</p>
        <p class="text-gray-700">${order.total_price.toFixed(2)}</p>
      </div>
    </div>
    
    <div class="mt-4">
      <p class="text-sm text-gray-500">Drop-off Date</p>
      <p class="text-gray-700">{new Date(order.drop_off_date).toLocaleDateString()}</p>
    </div>
    
    {#if order.pickup_date}
      <div class="mt-2">
        <p class="text-sm text-gray-500">Pickup Date</p>
        <p class="text-gray-700">{new Date(order.pickup_date).toLocaleDateString()}</p>
      </div>
    {/if}
    
    {#if order.notes}
      <div class="mt-4">
        <p class="text-sm text-gray-500">Notes</p>
        <p class="text-gray-700">{order.notes}</p>
      </div>
    {/if}
    
    <div class="mt-6">
      <label for="status-{order.id}" class="block text-sm font-medium text-gray-700">Update Status</label>
      <select 
        id="status-{order.id}" 
        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
        value={order.status}
        on:change={handleStatusChange}
      >
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="completed">Completed</option>
        <option value="picked_up">Picked Up</option>
      </select>
    </div>
  </div>
</div> 