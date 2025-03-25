<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchOrders, fetchLocations } from '$lib/api';
  import { orders, locations } from '$lib/stores';
  
  let reportType = 'daily';
  let locationFilter = 'all';
  let startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  let endDate = new Date();
  
  // Format dates for input fields
  $: startDateStr = startDate.toISOString().split('T')[0];
  $: endDateStr = endDate.toISOString().split('T')[0];
  
  // Report data
  let reportData = {
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    ordersByStatus: {
      pending: 0,
      processing: 0,
      completed: 0,
      picked_up: 0
    },
    ordersByLocation: {},
    dailyRevenue: [],
    topCustomers: []
  };
  
  onMount(async () => {
    await Promise.all([
      fetchOrders(),
      fetchLocations()
    ]);
    
    generateReport();
  });
  
  function generateReport() {
    // Filter orders by date range
    const filteredOrders = $orders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate >= startDate && orderDate <= endDate && 
             (locationFilter === 'all' || order.location_id.toString() === locationFilter);
    });
    
    // Calculate basic metrics
    reportData.totalOrders = filteredOrders.length;
    reportData.totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total_price, 0);
    reportData.averageOrderValue = reportData.totalOrders > 0 
      ? reportData.totalRevenue / reportData.totalOrders 
      : 0;
    
    // Reset status counts
    reportData.ordersByStatus = {
      pending: 0,
      processing: 0,
      completed: 0,
      picked_up: 0
    };
    
    // Reset location counts
    reportData.ordersByLocation = {};
    
    // Calculate orders by status and location
    filteredOrders.forEach(order => {
      reportData.ordersByStatus[order.status]++;
      
      if (!reportData.ordersByLocation[order.location_id]) {
        reportData.ordersByLocation[order.location_id] = 0;
      }
      reportData.ordersByLocation[order.location_id]++;
    });
    
    // Calculate daily revenue
    const dailyRevenue = {};
    filteredOrders.forEach(order => {
      const date = order.created_at.split('T')[0];
      if (!dailyRevenue[date]) {
        dailyRevenue[date] = 0;
      }
      dailyRevenue[date] += order.total_price;
    });
    
    reportData.dailyRevenue = Object.entries(dailyRevenue)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    // Calculate top customers
    const customerOrders = {};
    filteredOrders.forEach(order => {
      if (!order.customer) return;
      
      const customerId = order.customer.id;
      if (!customerOrders[customerId]) {
        customerOrders[customerId] = {
          id: customerId,
          name: `${order.customer.first_name} ${order.customer.last_name}`,
          orderCount: 0,
          totalSpent: 0
        };
      }
      
      customerOrders[customerId].orderCount++;
      customerOrders[customerId].totalSpent += order.total_price;
    });
    
    reportData.topCustomers = Object.values(customerOrders)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);
  }
</script>

<div class="bg-white rounded-lg shadow-md overflow-hidden">
  <div class="p-6">
    <h1 class="text-2xl font-bold text-gray-900">Reports</h1>
    
    <div class="mt-6 p-6 bg-gray-50 rounded-lg">
      <h2 class="text-lg font-medium text-gray-900">Report Parameters</h2>
      
      <div class="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-4">
        <div>
          <label for="report-type" class="block text-sm font-medium text-gray-700">Report Type</label>
          <select 
            id="report-type" 
            bind:value={reportType}
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            <option value="daily">Daily Revenue</option>
            <option value="status">Orders by Status</option>
            <option value="location">Orders by Location</option>
            <option value="customers">Top Customers</option>
          </select>
        </div>
        
        <div>
          <label for="location-filter" class="block text-sm font-medium text-gray-700">Location</label>
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
        
        <div>
          <label for="start-date" class="block text-sm font-medium text-gray-700">Start Date</label>
          <input 
            type="date" 
            id="start-date" 
            bind:value={startDateStr}
            class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label for="end-date" class="block text-sm font-medium text-gray-700">End Date</label>
          <input 
            type="date" 
            id="end-date" 
            bind:value={endDateStr}
            class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
      </div>
      
      <div class="mt-6">
        <button 
          type="button" 
          on:click={generateReport}
          class="btn btn-primary"
        >
          Generate Report
        </button>
      </div>
    </div>
    
    <div class="mt-8">
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <dt class="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">{reportData.totalOrders}</dd>
          </div>
        </div>
        
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <dt class="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">${reportData.totalRevenue.toFixed(2)}</dd>
          </div>
        </div>
        
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <dt class="text-sm font-medium text-gray-500 truncate">Average Order Value</dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">${reportData.averageOrderValue.toFixed(2)}</dd>
          </div>
        </div>
      </div>
      
      {#if reportType === 'daily'}
        <div class="mt-8">
          <h3 class="text-lg font-medium text-gray-900">Daily Revenue</h3>
          <div class="mt-4 overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {#each reportData.dailyRevenue as day}
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(day.date).toLocaleDateString()}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${day.revenue.toFixed(2)}</td>
                  </tr>
                {/each}
                
                {#if reportData.dailyRevenue.length === 0}
                  <tr>
                    <td colspan="2" class="px-6 py-12 text-center text-gray-500">
                      No data available for the selected period.
                    </td>
                  </tr>
                {/if}
              </tbody>
            </table>
          </div>
        </div>
      {:else if reportType === 'status'}
        <div class="mt-8">
          <h3 class="text-lg font-medium text-gray-900">Orders by Status</h3>
          <div class="mt-4 overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {#each Object.entries(reportData.ordersByStatus) as [status, count]}
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{status.replace('_', ' ')}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{count}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reportData.totalOrders > 0 ? ((count / reportData.totalOrders) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {:else if reportType === 'location'}
        <div class="mt-8">
          <h3 class="text-lg font-medium text-gray-900">Orders by Location</h3>
          <div class="mt-4 overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {#each Object.entries(reportData.ordersByLocation) as [locationId, count]}
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {$locations.find(l => l.id.toString() === locationId)?.name || 'Unknown'}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{count}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reportData.totalOrders > 0 ? ((count / reportData.totalOrders) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {:else if reportType === 'customers'}
        <div class="mt-8">
          <h3 class="text-lg font-medium text-gray-900">Top Customers</h3>
          <div class="mt-4 overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {#each reportData.topCustomers as customer}
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.name}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.orderCount}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${customer.totalSpent.toFixed(2)}</td>
                  </tr>
                {/each}
                
                {#if reportData.topCustomers.length === 0}
                  <tr>
                    <td colspan="3" class="px-6 py-12 text-center text-gray-500">
                      No data available for the selected period.
                    </td>
                  </tr>
                {/if}
              </tbody>
            </table>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div> 