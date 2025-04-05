<script lang="ts">
  import { page } from '$app/stores';
  import { currentUser } from '$lib/stores';
  import { supabase } from '$lib/supabase';
  import { onMount } from 'svelte';
  import LoginModal from '$lib/components/LoginModal.svelte';
  import RegisterModal from '$lib/components/RegisterModal.svelte';
  
  let isMenuOpen = false;
  let isUserMenuOpen = false;
  let showLoginModal = false;
  let showRegisterModal = false;
  let user = null;
  
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
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      currentUser.set(data.session.user);
    }
  });

  // Add scroll detection
  let scrollY: number;
  let prevScrollY = 0;
  let isNavbarVisible = true;

  function handleScroll() {
    scrollY = window.scrollY;
    isNavbarVisible = scrollY < prevScrollY || scrollY < 50;
    prevScrollY = scrollY;
  }

  onMount(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  // Check auth state
  supabase.auth.onAuthStateChange((_, session) => {
    user = session?.user ?? null;
  });

  function handleLoginSuccess() {
    showLoginModal = false;
  }

  function handleRegisterSuccess() {
    showRegisterModal = false;
  }

  function switchToRegister() {
    showLoginModal = false;
    showRegisterModal = true;
  }

  function switchToLogin() {
    showRegisterModal = false;
    showLoginModal = true;
  }
</script>

<header 
  class="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 transition-all duration-300"
  class:translate-y-0={isNavbarVisible}
  class:-translate-y-full={!isNavbarVisible}
>
  <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-20 items-center">
      <!-- Logo Section -->
      <div class="flex-shrink-0 flex items-center">
        <a 
          href="/" 
          class="flex items-center space-x-2 transition-transform duration-300 hover:scale-105"
        >
          <img 
            src="/images/logo.png" 
            alt="King Wash & Dry" 
            class="h-16 w-auto drop-shadow-md"
          />
        </a>
      </div>

      <!-- Navigation Links -->
      <div class="hidden lg:flex lg:space-x-1">
        {#each ['Home', 'Commercial', 'Locations'] as link}
          <a 
            href={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
            class="group relative px-4 py-2 text-sm font-medium transition-colors duration-200
                   {$page.url.pathname === (link === 'Home' ? '/' : '/' + link.toLowerCase()) ? 
                   'text-blue-600' : 'text-gray-600 hover:text-blue-600'}"
          >
            {link}
            <span class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 
                         transition-transform duration-200 group-hover:scale-x-100
                         {$page.url.pathname === (link === 'Home' ? '/' : '/' + link.toLowerCase()) ? 'scale-x-100' : ''}">
            </span>
          </a>
        {/each}
        
        {#if $currentUser}
          <a 
            href="/orders"
            class="group relative px-4 py-2 text-sm font-medium transition-colors duration-200
                   {$page.url.pathname === '/orders' ? 
                   'text-blue-600' : 'text-gray-600 hover:text-blue-600'}"
          >
            Orders
            <span class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 
                         transition-transform duration-200 group-hover:scale-x-100
                         {$page.url.pathname === '/orders' ? 'scale-x-100' : ''}">
            </span>
          </a>
        {/if}

        <a 
          href="/order"
          class="group relative px-4 py-2 text-sm font-medium transition-colors duration-200
                 {$page.url.pathname === '/order' ? 
                 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}"
        >
          Schedule Pickup
          <span class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 
                       transition-transform duration-200 group-hover:scale-x-100
                       {$page.url.pathname === '/order' ? 'scale-x-100' : ''}">
          </span>
        </a>
      </div>

      <!-- Right Side: Auth & Contact -->
      <div class="hidden lg:flex lg:items-center lg:space-x-4">
        <!-- Call Us Button -->
        <a
          href="tel:+19453355112"
          class="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium 
                 rounded-full text-white bg-gradient-to-r from-blue-600 to-blue-500 
                 hover:from-blue-700 hover:to-blue-600 transition-all duration-300 
                 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <svg class="w-4 h-4 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
          </svg>
          Call Us
        </a>

        <!-- Auth Buttons -->
        {#if $currentUser}
          <div class="relative">
            <button 
              type="button" 
              class="bg-white p-1.5 rounded-full flex text-sm border-2 border-gray-200 
                     hover:border-blue-500 transition-colors duration-300
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
              on:click={toggleUserMenu}
            >
              <div class="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 
                         flex items-center justify-center text-white font-medium shadow-inner">
                {$currentUser.user_metadata?.first_name?.[0] || $currentUser.email[0].toUpperCase()}
              </div>
            </button>

            {#if isUserMenuOpen}
              <div class="origin-top-right absolute right-0 mt-3 w-48 rounded-lg shadow-lg 
                         py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none
                         transform transition-all duration-200 ease-out">
                <!-- User Menu Items -->
                {#if $currentUser.user_metadata?.role === 'admin'}
                  <a href="/admin" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 
                                        hover:text-blue-600 transition-colors duration-150">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    Admin Dashboard
                  </a>
                {:else}
                  <a href="/account" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 
                                         hover:text-blue-600 transition-colors duration-150">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    My Account
                  </a>
                {/if}
                <button on:click={handleLogout} 
                        class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 
                               transition-colors duration-150">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  Sign Out
                </button>
              </div>
            {/if}
          </div>
        {:else}
          <button 
            on:click={() => showLoginModal = true}
            class="text-gray-600 hover:text-blue-600 px-4 py-2 rounded-md text-sm font-medium 
                   transition-colors duration-200">
            Sign In
          </button>
          <button 
            on:click={() => showRegisterModal = true}
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium 
                   rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-500 
                   hover:from-blue-700 hover:to-blue-600 transition-all duration-300 
                   shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Create Account
          </button>
        {/if}
      </div>

      <!-- Mobile menu button -->
      <div class="lg:hidden">
        <button 
          type="button" 
          class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 
                 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
          on:click={toggleMenu}
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu with slide animation -->
    {#if isMenuOpen}
      <div class="lg:hidden py-2 transform transition-all duration-300 ease-out">
        <!-- Mobile Navigation Links -->
        <div class="space-y-1 pb-3 pt-2">
          {#each ['Home', 'Commercial', 'Locations'] as link}
            <a 
              href={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
              class="block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200
                     {$page.url.pathname === (link === 'Home' ? '/' : '/' + link.toLowerCase()) ? 
                     'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}"
            >
              {link}
            </a>
          {/each}
          
          {#if $currentUser}
            <a 
              href="/orders"
              class="block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200
                     {$page.url.pathname === '/orders' ? 
                     'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}"
            >
              Orders
            </a>
          {/if}

          <a 
            href="/order"
            class="block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200
                   {$page.url.pathname === '/order' ? 
                   'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}"
          >
            Schedule Pickup
          </a>
        </div>

        <!-- Mobile Auth Section -->
        <div class="pt-4 pb-3 border-t border-gray-200">
          {#if $currentUser}
            <div class="px-3 py-2">
              <p class="text-base font-medium text-gray-800">
                {$currentUser.user_metadata?.first_name 
                  ? `${$currentUser.user_metadata.first_name} ${$currentUser.user_metadata.last_name}` 
                  : $currentUser.email}
              </p>
              <p class="text-sm text-gray-500">{$currentUser.email}</p>
            </div>
            <button 
              on:click={handleLogout}
              class="mt-2 block w-full text-left px-3 py-2 text-base font-medium text-red-600 
                     hover:bg-red-50 rounded-md transition-colors duration-200"
            >
              Sign Out
            </button>
          {:else}
            <div class="space-y-2 px-3">
              <a href="/login" 
                 class="block w-full text-center px-3 py-2 text-base font-medium text-gray-700 
                        hover:bg-gray-50 rounded-md transition-colors duration-200">
                Sign In
              </a>
              <a href="/register" 
                 class="block w-full text-center px-3 py-2 text-base font-medium text-white 
                        bg-gradient-to-r from-blue-600 to-blue-500 rounded-md 
                        hover:from-blue-700 hover:to-blue-600 transition-all duration-300 
                        shadow-md hover:shadow-lg">
                Create Account
              </a>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </nav>
</header>

{#if showLoginModal}
  <LoginModal 
    on:close={() => showLoginModal = false}
    on:success={handleLoginSuccess}
    on:switchToRegister={switchToRegister}
  />
{/if}

{#if showRegisterModal}
  <RegisterModal 
    on:close={() => showRegisterModal = false}
    on:success={handleRegisterSuccess}
    on:switchToLogin={switchToLogin}
  />
{/if} 