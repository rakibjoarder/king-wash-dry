<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchCustomers, addCustomer } from '$lib/api';
  import { customers } from '$lib/stores';
  
  let searchQuery = '';
  let showNewCustomerForm = false;
  
  // New customer form data
  let newCustomer = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  };
  
  onMount(async () => {
    await fetchCustomers();
  });
  
  function getFilteredCustomers() {
    if (!searchQuery) return $customers;
    
    const query = searchQuery.toLowerCase();
    return $customers.filter(customer => {
      const fullName = `${customer.first_name} ${customer.last_name}`.toLowerCase();
      const email = customer.email.toLowerCase();
      const phone = customer.phone;
      
      return fullName.includes(query) || email.includes(query) || phone.includes(query);
    });
  }
  
  async function handleCreateCustomer() {
    if (!newCustomer.first_name || !newCustomer.last_name || !newCustomer.phone) {
      alert('Please fill in all required fields');
      return;
    }
    
    const result = await addCustomer(newCustomer);
    
    if (result) {
      showNewCustomerForm = false;
      // Reset form
      newCustomer = {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: ''
      };
    }
  }
</script>

<div class="bg-white rounded-lg shadow-md overflow-hidden">
  <div class="p-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Customers</h1>
      <button 
        on:click={() => showNewCustomerForm = !showNewCustomerForm}
        class="btn btn-primary"
      >
        {showNewCustomerForm ? 'Cancel' : 'New Customer'}
      </button>
    </div>
    
    {#if showNewCustomerForm}
      <div class="mt-6 p-6 bg-gray-50 rounded-lg">
        <h2 class="text-lg font-medium text-gray-900">Add New Customer</h2>
        
        <div class="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div class="sm:col-span-3">
            <label for="first-name" class="block text-sm font-medium text-gray-700">First name</label>
            <input 
              type="text" 
              id="first-name" 
              bind:value={newCustomer.first_name}
              class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          
          <div class="sm:col-span-3">
            <label for="last-name" class="block text-sm font-medium text-gray-700">Last name</label>
            <input 
              type="text" 
              id="last-name" 
              bind:value={newCustomer.last_name}
              class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          
          <div class="sm:col-span-3">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              id="email" 
              bind:value={newCustomer.email}
              class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          
          <div class="sm:col-span-3">
            <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
            <input 
              type="tel" 
              id="phone" 
              bind:value={newCustomer.phone}
              class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          
          <div class="sm:col-span-6">
            <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
            <input 
              type="text" 
              id="address" 
              bind:value={newCustomer.address}
              class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          
          <div class="sm:col-span-2">
            <label for="city" class="block text-sm font-medium text-gray-700">City</label>
            <input 
              type="text" 
              id="city" 
              bind:value={newCustomer.city}
              class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          
          <div class="sm:col-span-2">
            <label for="state" class="block text-sm font-medium text-gray-700">State</label>
            <input 
              type="text" 
              id="state" 
              bind:value={newCustomer.state}
              class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          
          <div class="sm:col-span-2">
            <label for="zip" class="block text-sm font-medium text-gray-700">ZIP / Postal code</label>
            <input 
              type="text" 
              id="zip" 
              bind:value={newCustomer.zip}
              class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <div class="mt-6 flex justify-end">
          <button 
            type="button" 
            on:click={() => showNewCustomerForm = false}
            class="btn btn-secondary mr-3"
          >
            Cancel
          </button>
          <button 
            type="button" 
            on:click={handleCreateCustomer}
            class="btn btn-primary"
          >
            Add Customer
          </button>
        </div>
      </div>
    {/if}
    
    <div class="mt-6">
      <div class="w-full md:w-1/3 mb-6">
        <label for="search" class="block text-sm font-medium text-gray-700">Search Customers</label>
        <input 
          type="text" 
          id="search" 
          bind:value={searchQuery}
          placeholder="Search by name, email, or phone"
          class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each getFilteredCustomers() as customer}
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{customer.first_name} {customer.last_name}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{customer.email}</div>
                  <div class="text-sm text-gray-500">{customer.phone}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{customer.address}</div>
                  <div class="text-sm text-gray-500">{customer.city}, {customer.state} {customer.zip}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(customer.created_at).toLocaleDateString()}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <a href={`/admin/customers/${customer.id}`} class="text-primary-600 hover:text-primary-900 mr-3">View</a>
                  <a href={`/admin/customers/${customer.id}/edit`} class="text-primary-600 hover:text-primary-900">Edit</a>
                </td>
              </tr>
            {/each}
            
            {#if getFilteredCustomers().length === 0}
              <tr>
                <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                  No customers found matching your search.
                </td>
              </tr>
            {/if}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div> 