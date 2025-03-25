<script lang="ts">
  import { page } from '$app/stores';
  import { currentUser } from '$lib/stores';
  import { supabase } from '$lib/supabase';
  import { onMount } from 'svelte';
  
  let isMenuOpen = false;
  let isUserMenuOpen = false;
  
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
  
  function toggleUserMenu() {
    isUserMenuOpen = !isUserMenuOpen;
  }
  
  async function handleLogout() {
    await supabase.auth.signOut();
    currentUser.set(null);
  }
  
  onMount(async () => {
    // Check if user is already logged in
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      currentUser.set(data.session.user);
    }
  });
</script>

<nav class="bg-white shadow-md">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <div class="flex">
        <div class="flex-shrink-0 flex items-center">
          <a href="/" class="text-xl font-bold text-primary-600">King Wash & Dry</a>
        </div>
        <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
          <a 
            href="/" 
            class="{$page.url.pathname === '/' ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
          >
            Home
          </a>
          <a 
            href="/services" 
            class="{$page.url.pathname === '/services' ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
          >
            Services
          </a>
          <a 
            href="/locations" 
            class="{$page.url.pathname === '/locations' ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
          >
            Locations
          </a>
          <a 
            href="/order" 
            class="{$page.url.pathname === '/order' ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
          >
            Schedule Pickup
          </a>
          <a 
            href="/orders" 
            class="{$page.url.pathname === '/orders' ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
          >
            Orders
          </a>
        </div>
      </div>
      <div class="hidden sm:ml-6 sm:flex sm:items-center">
        {#if $currentUser}
          <div class="ml-3 relative">
            <div>
              <button 
                type="button" 
                class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500" 
                id="user-menu-button" 
                aria-expanded="false" 
                aria-haspopup="true"
                on:click={toggleUserMenu}
              >
                <span class="sr-only">Open user menu</span>
                <div class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-medium">
                  {$currentUser.user_metadata?.first_name?.[0] || $currentUser.email[0].toUpperCase()}
                </div>
              </button>
            </div>
            
            {#if isUserMenuOpen}
              <div 
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" 
                role="menu" 
                aria-orientation="vertical" 
                aria-labelledby="user-menu-button" 
                tabindex="-1"
              >
                {#if $currentUser.user_metadata?.role === 'admin'}
                  <a 
                    href="/admin" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                    role="menuitem" 
                    tabindex="-1"
                  >
                    Admin Dashboard
                  </a>
                {:else}
                  <a 
                    href="/account" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                    role="menuitem" 
                    tabindex="-1"
                  >
                    My Account
                  </a>
                  <a 
                    href="/account/edit" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                    role="menuitem" 
                    tabindex="-1"
                  >
                    Edit Profile
                  </a>
                {/if}
                <button 
                  on:click={handleLogout}
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                  role="menuitem" 
                  tabindex="-1"
                >
                  Sign Out
                </button>
              </div>
            {/if}
          </div>
        {:else}
          <a 
            href="/login" 
            class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
          >
            Sign In
          </a>
          <a 
            href="/register" 
            class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Create Account
          </a>
        {/if}
      </div>
      <div class="-mr-2 flex items-center sm:hidden">
        <button 
          type="button" 
          class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500" 
          aria-controls="mobile-menu" 
          aria-expanded="false"
          on:click={toggleMenu}
        >
          <span class="sr-only">Open main menu</span>
          <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>

  <div class="{isMenuOpen ? 'block' : 'hidden'} sm:hidden">
    <div class="pt-2 pb-3 space-y-1">
      <a 
        href="/" 
        class="{$page.url.pathname === '/' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
      >
        Home
      </a>
      <a 
        href="/services" 
        class="{$page.url.pathname === '/services' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
      >
        Services
      </a>
      <a 
        href="/locations" 
        class="{$page.url.pathname === '/locations' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
      >
        Locations
      </a>
      <a 
        href="/order" 
        class="{$page.url.pathname === '/order' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
      >
        Schedule Pickup
      </a>
      <a 
      href="/orders" 
      class="{$page.url.pathname === '/order' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
    >
     Orders
    </a>
    </div>
    <div class="pt-4 pb-3 border-t border-gray-200">
      {#if $currentUser}
        <div class="flex items-center px-4">
          <div class="flex-shrink-0">
            <div class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-medium">
              {$currentUser.user_metadata?.first_name?.[0] || $currentUser.email[0].toUpperCase()}
            </div>
          </div>
          <div class="ml-3">
            <div class="text-base font-medium text-gray-800">
              {$currentUser.user_metadata?.first_name 
                ? `${$currentUser.user_metadata.first_name} ${$currentUser.user_metadata.last_name}` 
                : $currentUser.email}
            </div>
            <div class="text-sm font-medium text-gray-500">{$currentUser.email}</div>
          </div>
        </div>
        <div class="mt-3 space-y-1">
          {#if $currentUser.user_metadata?.role === 'admin'}
            <a 
              href="/admin" 
              class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
            >
              Admin Dashboard
            </a>
          {:else}
            <a 
              href="/account" 
              class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
            >
              My Account
            </a>
            <a 
              href="/account/edit" 
              class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
            >
              Edit Profile
            </a>
          {/if}
          <button 
            on:click={handleLogout}
            class="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
          >
            Sign Out
          </button>
        </div>
      {:else}
        <div class="space-y-1">
          <a 
            href="/login" 
            class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
          >
            Sign In
          </a>
          <a 
            href="/register" 
            class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
          >
            Create Account
          </a>
        </div>
      {/if}
    </div>
  </div>
</nav> 