<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { currentUser } from '$lib/stores';
  
  onMount(() => {
    const unsubscribe = currentUser.subscribe(user => {
      if (!user) {
        goto('/login');
      }
    });
    
    return unsubscribe;
  });
</script>

<div class="bg-gray-100 min-h-screen">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div class="flex flex-col md:flex-row gap-6">
      <div class="w-full md:w-64 flex-shrink-0">
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-4 bg-primary-700 text-white">
            <h2 class="text-lg font-semibold">Admin Dashboard</h2>
          </div>
          <nav class="p-4">
            <ul class="space-y-2">
              <li>
                <a 
                  href="/admin" 
                  class="block px-4 py-2 rounded-md {$page.url.pathname === '/admin' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a 
                  href="/admin/orders" 
                  class="block px-4 py-2 rounded-md {$page.url.pathname === '/admin/orders' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}"
                >
                  Orders
                </a>
              </li>
              <li>
                <a 
                  href="/admin/customers" 
                  class="block px-4 py-2 rounded-md {$page.url.pathname === '/admin/customers' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}"
                >
                  Customers
                </a>
              </li>
              <li>
                <a 
                  href="/admin/reports" 
                  class="block px-4 py-2 rounded-md {$page.url.pathname === '/admin/reports' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}"
                >
                  Reports
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      
      <div class="flex-1">
        <slot />
      </div>
    </div>
  </div>
</div> 