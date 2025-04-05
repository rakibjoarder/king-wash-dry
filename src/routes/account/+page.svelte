<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabase';
  import { currentUser } from '$lib/stores';
  import LoginModal from '$lib/components/LoginModal.svelte';
  
  interface CustomerData {
    id: number;
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  }

  interface OrderData {
    id: number;
    customer_id: number;
    created_at: string;
    status: string;
    total_price: number;
    location?: { id: number; name: string };
    service?: { id: number; name: string; price: number };
  }
  
  let customerData: CustomerData | null = null;
  let orders: OrderData[] = [];
  let loading = true;
  let error = '';
  let showLoginModal = false;
  
  onMount(async () => {
    try {
      // Check if user is logged in
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        showLoginModal = true;
        return;
      }
      
      currentUser.set(data.session.user);
      
      // Fetch customer data
      const { data: customerResult, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', data.session.user.id)
        .single();
      
      if (customerError) {
        console.error('Error fetching customer:', customerError);
        // If no customer record exists, try to create one
        if (customerError.code === 'PGRST116') {
          const response = await fetch('/api/customers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              user_id: data.session.user.id,
              email: data.session.user.email,
              first_name: data.session.user.user_metadata?.first_name || '',
              last_name: data.session.user.user_metadata?.last_name || '',
              phone: data.session.user.phone || ''
            })
          });
          
          if (response.ok) {
            // Retry fetching customer data
            const { data: retryData, error: retryError } = await supabase
              .from('customers')
              .select('*')
              .eq('user_id', data.session.user.id)
              .single();
              
            if (retryError) throw retryError;
            customerData = retryData;
          } else {
            throw new Error('Failed to create customer record');
          }
        } else {
          throw customerError;
        }
      } else {
        customerData = customerResult;
      }
      
      // Only fetch orders if we have a valid customer
      if (customerData?.id) {
        // Fetch customer orders
        const { data: ordersResult, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('customer_id', customerData.id)
          .order('created_at', { ascending: false });
        
        if (ordersError) throw ordersError;
        
        // Map the orders with location and service data
        orders = ordersResult.map(order => ({
          ...order,
          location: order.location_id ? { id: order.location_id, name: 'Location ' + order.location_id } : undefined,
          service: order.service_id ? { id: order.service_id, name: 'Service ' + order.service_id, price: order.total_price } : undefined
        }));
      }
    } catch (err) {
      console.error('Error fetching account data:', err);
      error = 'Failed to load your account data. Please try again.';
    } finally {
      loading = false;
    }
  });
  
  function handleLoginSuccess() {
    showLoginModal = false;
    window.location.reload(); // Reload to fetch account data with new session
  }
  
  function getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'picked_up':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  
  function formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }
  
  function formatStatus(status: string): string {
    return status.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  }
</script>

<div class="bg-primary-700 text-white py-12">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-extrabold">My Account</h1>
    <p class="mt-4 text-xl">Manage your account and track your orders</p>
  </div>
</div>

{#if showLoginModal}
  <LoginModal 
    on:close={() => goto('/')} 
    on:success={handleLoginSuccess}
  />
{:else}
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    {#if loading}
      <div class="flex justify-center">
        <svg class="animate-spin h-10 w-10 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    {:else if error}
      <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    {:else}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-1">
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-xl font-bold mb-4">Account Information</h2>
            
            {#if customerData}
              <div class="space-y-4">
                <div>
                  <h3 class="text-sm font-medium text-gray-500">Name</h3>
                  <p class="mt-1">{customerData.first_name} {customerData.last_name}</p>
                </div>
                
                <div>
                  <h3 class="text-sm font-medium text-gray-500">Email</h3>
                  <p class="mt-1">{customerData.email}</p>
                </div>
                
                <div>
                  <h3 class="text-sm font-medium text-gray-500">Phone</h3>
                  <p class="mt-1">{customerData.phone}</p>
                </div>
                
                {#if customerData.address}
                  <div>
                    <h3 class="text-sm font-medium text-gray-500">Address</h3>
                    <p class="mt-1">{customerData.address}</p>
                    <p>{customerData.city}, {customerData.state} {customerData.zip}</p>
                  </div>
                {/if}
              </div>
              
              <div class="mt-6">
                <a href="/account/edit" class="btn btn-secondary w-full">Edit Profile</a>
              </div>
            {/if}
            
            <div class="mt-4">
              <button 
                on:click={() => supabase.auth.signOut().then(() => goto('/'))}
                class="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign Out
              </button>
            </div>
          </div>
          
          <div class="mt-8 bg-white shadow rounded-lg p-6">
            <h2 class="text-xl font-bold mb-4">Quick Actions</h2>
            
            <div class="space-y-4">
              <a href="/order" class="btn btn-primary w-full">Schedule a Pickup</a>
            </div>
          </div>
        </div>
        
        <div class="lg:col-span-2">
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-xl font-bold mb-4">Order History</h2>
            
            {#if orders.length === 0}
              <div class="text-center py-8">
                <p class="text-gray-500">You haven't placed any orders yet.</p>
                <a href="/order" class="mt-4 inline-block btn btn-primary">Schedule Your First Pickup</a>
              </div>
            {:else}
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    {#each orders as order}
                      <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.service?.name}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.created_at)}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {getStatusBadgeClass(order.status)}">
                            {formatStatus(order.status)}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.total_price.toFixed(2)}</td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </div>
{/if} 