<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import { formatCurrency } from '$lib/utils/formatting';
  import type { Order } from '$lib/types';
  import { fade, fly } from 'svelte/transition';
  import LoginModal from '$lib/components/LoginModal.svelte';
  
  const orderId = $page.url.searchParams.get('id');
  
  let order: Order | null = null;
  let loading = true;
  let error: string | null = null;
  let timelineVisible = false;
  let showLoginModal = false;
  let email = '';
  let password = '';
  
  // Format date for display
  function formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  // Format time for display
  function formatTime(timeString: string): string {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  }
  
  // Get time slot label
  function getTimeSlotLabel(timeValue: string): string {
    const timeSlots: Record<string, string> = {
      '08:00': '8:00 AM - 10:00 AM',
      '10:00': '10:00 AM - 12:00 PM',
      '12:00': '12:00 PM - 2:00 PM',
      '14:00': '2:00 PM - 4:00 PM',
      '16:00': '4:00 PM - 6:00 PM',
      '18:00': '6:00 PM - 8:00 PM'
    };
    return timeSlots[timeValue] || timeValue;
  }
  
  // Open login modal
  function openLoginModal() {
    showLoginModal = true;
  }
  
  // Close login modal
  function closeLoginModal() {
    showLoginModal = false;
  }
  
  // Handle login
  async function handleLogin(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      showLoginModal = false;
      loading = true;
      await fetchOrder();
    } catch (err) {
      alert('Failed to log in. Please check your credentials and try again.');
    }
  }
  
  // Handle login success
  function handleLoginSuccess() {
    showLoginModal = false;
    loading = true;
    fetchOrder();
  }
  
  // Fetch order details
  async function fetchOrder() {
    try {
      loading = true;
      
      if (!orderId) {
        error = 'Order ID is missing';
        loading = false;
        return;
      }
      
      // Get the current session to access the token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        error = 'Please log in to view your order';
        showLoginModal = true;
        loading = false;
        return;
      }
      
      const response = await fetch(`/api/order-confirmation?id=${orderId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          error = 'Please log in to view your order';
          showLoginModal = true;
        } else if (response.status === 404) {
          error = 'Order not found';
        } else {
          error = 'Failed to load order details';
        }
        loading = false;
        return;
      }
      
      order = await response.json();
    } catch (err) {
      console.error('Error in fetchOrder:', err);
      error = 'An unexpected error occurred';
    } finally {
      loading = false;
    }
  }
  
  onMount(() => {
    fetchOrder();
    // Show timeline with a slight delay for animation
    setTimeout(() => {
      timelineVisible = true;
    }, 500);
  });
</script>

<style>
  /* Timeline animations */
  .step-circle {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .step-circle:hover {
    transform: scale(1.1);
    box-shadow: 0 0 15px rgba(66, 153, 225, 0.5);
  }
  
  .progress-line {
    background: linear-gradient(90deg, #3b82f6 0%, #4f46e5 50%, #2563eb 100%);
    background-size: 200% 100%;
    animation: progress-animation 3s ease-in-out infinite alternate;
  }
  
  @keyframes progress-animation {
    0% {
      background-position: 0% 0%;
    }
    100% {
      background-position: 100% 0%;
    }
  }
  
  .pulse-animation {
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(37, 99, 235, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(37, 99, 235, 0);
    }
  }
</style>

<svelte:head>
  <title>Order Confirmation | King Wash & Dry</title>
</svelte:head>

<div class="space-y-4">
  {#if loading}
    <div class="flex justify-center my-8">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  {:else if error}
    <div class="max-w-lg mx-auto mt-12 px-4">
    <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        {#if error.includes('log in')}
          <div class="flex flex-col items-center">
            <div class="bg-red-100 rounded-full p-3 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 class="text-xl font-bold text-red-700 mb-3">Authentication Required</h2>
            <p class="text-red-600 mb-5">You need to be logged in to view order details. Please log in to access your order information.</p>
            <div class="flex gap-3">
              <button on:click={openLoginModal} class="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Log In
              </button>
              <a href="/" class="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                Return Home
              </a>
            </div>
          </div>
        {:else}
          <h2 class="text-lg font-semibold text-red-600 mb-2">Error</h2>
      <p class="text-red-700">{error}</p>
          <a href="/" class="btn btn-primary mt-3">Return to Home</a>
        {/if}
      </div>
    </div>
  {:else if order}
    <div class="max-w-5xl mx-auto px-3 sm:px-4 mt-8">
      <!-- Unified white background wrapper -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-6">
        <!-- Header - Elegant with subtle background -->
        <div class="bg-blue-50 p-4 border-b border-blue-100">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
              <img src="/images/logo.png" alt="King Wash & Dry" class="h-12 mb-1" />
              <div class="flex items-center mt-1">
                <span class="text-xs font-medium text-gray-500 mr-1">Order ID:</span>
                <span class="font-semibold text-sm">{order.id}</span>
              </div>
              <p class="text-sm text-gray-600 mt-0.5">Thank you for choosing King Wash & Dry</p>
          </div>
            <div class="mt-3 sm:mt-0">
              {#if order.status?.toLowerCase() === 'pending'}
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-100">
                  {(order.status || 'PENDING').toUpperCase()}
                </span>
              {:else if order.status?.toLowerCase() === 'processing'}
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                  {(order.status || 'PROCESSING').toUpperCase()}
                </span>
              {:else if order.status?.toLowerCase() === 'completed'}
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                  {(order.status || 'COMPLETED').toUpperCase()}
                </span>
              {:else if order.status?.toLowerCase() === 'cancelled'}
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                  {(order.status || 'CANCELLED').toUpperCase()}
                </span>
              {:else}
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                  {(order.status || 'CONFIRMED').toUpperCase()}
            </span>
              {/if}
            </div>
          </div>
        </div>
        
        <div class="p-4">
          <!-- Main Content - Two Column Layout with reduced gaps -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <!-- Left Column - Service and Schedule Details -->
            <div class="lg:col-span-2 space-y-4">
              <!-- Service Information Card - Modern design with clear visual hierarchy -->
              <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div class="bg-blue-50 px-4 py-2 border-b border-blue-100">
                  <h2 class="text-base font-semibold text-gray-900">Service Details</h2>
                </div>
                <div class="p-4">
                  <div class="flex items-start">
                    <div class="flex-shrink-0 mr-3">
                      <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
        </div>
      </div>
        <div>
                      <h3 class="text-base font-medium text-gray-900">{order.service?.name || 'N/A'}</h3>
                      <div class="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Weight: {order.weight} lbs
                      </div>
            {#if order.notes}
                        <p class="text-xs text-gray-600 mt-2 bg-gray-50 p-2 rounded-lg border-l-2 border-blue-400">
                          <span class="block text-xs uppercase text-gray-500 font-medium mb-0.5">Note</span>
                {order.notes}
              </p>
            {/if}
                    </div>
                  </div>
          </div>
        </div>
        
              <!-- Order Items - List of items in the order -->
              <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div class="bg-blue-50 px-4 py-2 border-b border-blue-100">
                  <h2 class="text-base font-semibold text-gray-900">Order Items</h2>
                </div>
                <div class="p-4">
                  {#if order.items && order.items.length > 0}
                    <div class="space-y-2">
                      {#each order.items as item}
                        <div class="flex justify-between p-2 bg-gray-50 rounded-lg">
                          <div class="flex items-start">
                            <div class="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                              {#if (item as any).icon === 'shirt'}
                                <!-- Shirt Icon -->
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 2L2 6v14a2 2 0 002 2h16a2 2 0 002-2V6l-4-4M6 2h4l2 2 2-2h4" />
                                </svg>
                              {:else if (item as any).icon === 'pants'}
                                <!-- Pants Icon -->
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v18m6-18v18M3 7h18M3 11h18" />
                                </svg>
                              {:else if (item as any).icon === 'dress'}
                                <!-- Dress Icon -->
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2C8 2 5 3 5 7c0 2 1 3 2.5 4C8.5 15 8 19 12 19s3.5-4 4.5-8C18 10 19 9 19 7c0-4-3-5-7-5z" />
                                </svg>
                              {:else if (item as any).icon === 'jacket'}
                                <!-- Jacket Icon -->
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 2L2 6v14a2 2 0 002 2h16a2 2 0 002-2V6l-4-4M6 2h4l6 6-6 6m4-12l6 6-6 6" />
                                </svg>
                              {:else if (item as any).icon === 'sock'}
                                <!-- Sock Icon -->
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2C9 2 7 3 7 8c0 3 2 6 2 9 0 3 2 5 3 5s3-2 3-5c0-3 2-6 2-9 0-5-2-6-5-6z" />
                                </svg>
                              {:else if (item as any).icon === 'towel'}
                                <!-- Towel Icon -->
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4h16v6H4zM4 10h16v10H4z" />
                                </svg>
                              {:else if (item as any).icon === 'bedding'}
                                <!-- Bedding Icon -->
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12H3m0 0l2-7h14l2 7m0 0v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6z" />
                                </svg>
                              {:else}
                                <!-- Default Icon -->
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                              {/if}
                            </div>
        <div>
                              <div class="flex items-center">
                                <h4 class="font-medium text-gray-900 text-sm">{(item as any).name || 'Item'}</h4>
                                {#if (item as any).quantity && (item as any).quantity > 0}
                                  <span class="ml-1 bg-indigo-100 text-indigo-800 text-xs font-medium px-1.5 py-0.5 rounded-full">
                                    x{(item as any).quantity}
                                  </span>
                                {/if}
                              </div>
                            </div>
                          </div>
                          
                          <div class="ml-2 flex flex-col items-end justify-center">
                            {#if (item as any).price}
                              <span class="font-medium text-gray-900 text-sm">{formatCurrency((item as any).price)}</span>
                            {/if}
                            {#if (item as any).quantity && (item as any).price && (item as any).quantity > 1}
                              <span class="text-xs text-gray-500">
                                {formatCurrency((item as any).price)} × {(item as any).quantity}
                              </span>
                            {/if}
                          </div>
                        </div>
                      {/each}
                    </div>
            {:else}
                    <div class="text-gray-500 italic text-center py-2 text-sm">
                      <p>No specific items listed in this order</p>
                    </div>
            {/if}
          </div>
        </div>
        
              <!-- Preferences Section -->
              <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div class="bg-blue-50 px-4 py-2 border-b border-blue-100">
                  <h2 class="text-base font-semibold text-gray-900">Preferences</h2>
                </div>
                <div class="p-4">
                  {#if order.preferences && Object.keys(order.preferences).length > 0}
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {#each Object.entries(order.preferences) as [key, value]}
                        {#if key !== 'additionalServices' && key !== 'specialInstructions' && typeof value !== 'object'}
                          <div class="flex items-start">
                            <div class="flex-shrink-0 mr-2">
                              <div class="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            </div>
                            <div>
                              <p class="font-medium text-gray-900 capitalize text-xs">{key.replace(/_/g, ' ')}</p>
                              <p class="text-xs text-gray-600">{value}</p>
                            </div>
                          </div>
                        {/if}
                      {/each}
                      
                      {#if order.preferences.additionalServices}
                        <div class="flex items-start col-span-full">
                          <div class="flex-shrink-0 mr-2">
                            <div class="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                          <div>
                            <p class="font-medium text-gray-900 capitalize text-xs mb-1">Additional Services</p>
                            <div class="flex flex-wrap gap-1">
                              {#each Object.entries(order.preferences.additionalServices) as [serviceName, isSelected]}
                                {#if isSelected}
                                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-indigo-50 text-indigo-700">
                                    <svg class="h-2.5 w-2.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    {serviceName.replace(/([A-Z])/g, ' $1').trim()}
                                  </span>
                                {/if}
                              {/each}
                            </div>
                          </div>
                        </div>
                      {/if}
                      
                      {#if order.preferences.specialInstructions && order.preferences.specialInstructions.trim() !== ''}
                        <div class="flex items-start col-span-full mt-2">
                          <div class="flex-shrink-0 mr-2">
                            <div class="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                              </svg>
                            </div>
                          </div>
        <div>
                            <p class="font-medium text-gray-900 capitalize text-xs">Special Instructions</p>
                            <p class="text-xs text-gray-600">{order.preferences.specialInstructions}</p>
                          </div>
                        </div>
                      {/if}
                    </div>
                  {:else}
                    <div class="text-gray-500 italic text-center py-2 text-sm">
                      <p>No custom preferences set for this order</p>
                    </div>
            {/if}
          </div>
        </div>
        
              <!-- Schedule Card - Timeline-style with clean separation -->
              <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div class="bg-blue-50 px-4 py-2 border-b border-blue-100">
                  <h2 class="text-base font-semibold text-gray-900">Schedule</h2>
                </div>
                <div class="p-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Pickup -->
                    <div class="relative pl-4 border-l-2 border-blue-200">
                      <div class="absolute -left-1.5 top-0">
                        <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                      </div>
                      <div class="flex items-center mb-2">
                        <div class="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                        </div>
                        <h3 class="text-sm font-medium text-gray-900">Pickup</h3>
                      </div>
                      <div class="ml-9 bg-gray-50 rounded-lg p-2">
                        <div class="flex items-center mb-1 text-xs">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span class="font-medium">{formatDate(order.drop_off_date)}</span>
                          <span class="mx-1 text-gray-400">|</span>
                          {getTimeSlotLabel(order.drop_off_time)}
                        </div>
                        <div class="flex items-start text-xs">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-blue-500 mr-1 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div>
                            <p class="text-gray-900">{order.address}</p>
                            <p class="text-gray-500">{order.city}, {order.state} {order.zip}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Delivery -->
                    <div class="relative pl-4 border-l-2 border-green-200">
                      <div class="absolute -left-1.5 top-0">
                        <div class="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div class="flex items-center mb-2">
                        <div class="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                          </svg>
                        </div>
                        <h3 class="text-sm font-medium text-gray-900">Delivery</h3>
                      </div>
                      <div class="ml-9 bg-gray-50 rounded-lg p-2">
                        <div class="flex items-center mb-1 text-xs">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span class="font-medium">{formatDate(order.pickup_date || '')}</span>
                          <span class="mx-1 text-gray-400">|</span>
                          {getTimeSlotLabel(order.pickup_time || '')}
                        </div>
                        <div class="flex items-start text-xs">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-green-500 mr-1 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
        <div>
                            <p class="text-gray-900">{order.address}</p>
                            <p class="text-gray-500">{order.city}, {order.state} {order.zip}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Process Timeline -->
              <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div class="bg-blue-50 px-4 py-2 border-b border-blue-100">
                  <h2 class="text-base font-semibold text-gray-900">How We Process Your Order</h2>
                </div>
                <div class="p-4">
                  <div class="flex items-center justify-between relative">
                    <!-- Horizontal line connecting all steps -->
                    <div class="absolute h-1 bg-gray-200 top-4 left-8 right-8"></div>
                    
                    <!-- Animated progress line -->
                    {#if timelineVisible}
                      <div class="absolute h-1 progress-line top-4 left-8 right-8 z-0" style="width: calc(100% - 4rem);" transition:fly={{ x: -100, duration: 1000 }}></div>
                    {/if}
                    
                    <!-- Step 1 -->
                    <div class="relative flex flex-col items-center z-10 w-1/3">
                      {#if timelineVisible}
                        <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm step-circle pulse-animation" 
                             transition:fly={{ y: 50, duration: 500, delay: 300 }}>1</div>
                        <p class="mt-2 text-xs font-medium text-gray-700 text-center" transition:fade={{ duration: 300, delay: 600 }}>We Pick Up<br/>Your Laundry</p>
            {/if}
                    </div>
                    
                    <!-- Step 2 -->
                    <div class="relative flex flex-col items-center z-10 w-1/3">
                      {#if timelineVisible}
                        <div class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm step-circle pulse-animation" 
                             transition:fly={{ y: 50, duration: 500, delay: 600 }}>2</div>
                        <p class="mt-2 text-xs font-medium text-gray-700 text-center" transition:fade={{ duration: 300, delay: 900 }}>Professional<br/>Cleaning</p>
            {/if}
                    </div>
                    
                    <!-- Step 3 -->
                    <div class="relative flex flex-col items-center z-10 w-1/3">
                      {#if timelineVisible}
                        <div class="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm shadow-sm step-circle pulse-animation" 
                             transition:fly={{ y: 50, duration: 500, delay: 900 }}>3</div>
                        <p class="mt-2 text-xs font-medium text-gray-700 text-center" transition:fade={{ duration: 300, delay: 1200 }}>We Deliver<br/>Clean Laundry</p>
            {/if}
                    </div>
                  </div>
                  
                  <div class="mt-4 bg-blue-50 rounded-lg p-3 text-xs text-blue-800">
                    <p class="font-medium mb-1">What to expect:</p>
                    <ul class="space-y-1">
                      <li class="flex items-start">
                        <svg class="h-3 w-3 text-blue-600 mr-1 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Our driver will arrive during your selected pickup time slot
                      </li>
                      <li class="flex items-start">
                        <svg class="h-3 w-3 text-blue-600 mr-1 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        You'll receive text updates when your order status changes
                      </li>
                      <li class="flex items-start">
                        <svg class="h-3 w-3 text-blue-600 mr-1 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        We'll deliver your fresh, clean laundry during your selected delivery time slot
                      </li>
                    </ul>
                  </div>
          </div>
        </div>
      </div>
      
            <!-- Right Column - Payment & Customer Info -->
            <div class="lg:col-span-1 space-y-8">
              <!-- Payment Summary Card - Elegant pricing display -->
              <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div class="bg-blue-50 px-4 py-2 border-b border-blue-100">
                  <h2 class="text-base font-semibold text-gray-900">Payment Summary</h2>
                </div>
                <div class="p-4">
                  <div class="space-y-2">
                    <div class="flex justify-between items-center text-sm">
                      <span class="text-gray-600">Subtotal</span>
                      <span class="font-medium">{formatCurrency(order.total_price)}</span>
                    </div>
                    
                    {#if order.tip_amount && order.tip_amount > 0}
                      <div class="flex justify-between items-center text-sm">
                        <span class="text-gray-600">Tip</span>
                        <span class="font-medium">{formatCurrency(order.tip_amount)}</span>
                      </div>
                  {/if}
                    
                    {#if order.discount_amount && order.discount_amount > 0}
                      <div class="flex justify-between items-center text-sm">
                        <span class="text-gray-600">Discount</span>
                        <span class="font-medium text-green-600">-{formatCurrency(order.discount_amount)}</span>
          </div>
                    {/if}
                    
                    {#if order.promo_code}
                      <div class="flex items-center bg-yellow-50 p-1.5 rounded-md text-xs">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-yellow-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span class="text-gray-700">Promo: <span class="font-mono uppercase">{order.promo_code}</span></span>
        </div>
      {/if}
      
                    <div class="border-t border-gray-200 pt-2 mt-2">
                      <div class="flex justify-between items-center">
                        <span class="font-medium text-gray-900">Total</span>
                        <span class="font-bold text-green-600 text-lg">{formatCurrency(order.total_price)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Customer Information Card - Clean with proper spacing -->
              <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div class="bg-blue-50 px-4 py-2 border-b border-blue-100">
                  <h2 class="text-base font-semibold text-gray-900">Customer Information</h2>
                </div>
                <div class="p-4">
                  <div class="space-y-3">
                    <div>
                      <p class="text-xs uppercase text-gray-500 font-medium mb-0.5">Name</p>
                      <p class="font-medium text-gray-900">{order.first_name} {order.last_name}</p>
                    </div>
            <div>
                      <p class="text-xs uppercase text-gray-500 font-medium mb-0.5">Contact</p>
                      <p class="font-medium text-gray-900 text-sm">{order.email}</p>
                      <p class="text-gray-600 text-sm">{order.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Service Promise Box - Visually appealing with clear messaging -->
              <div class="bg-blue-50 rounded-lg border border-blue-100 p-3">
                <div class="flex items-start space-x-2">
                  <div class="flex-shrink-0">
                    <div class="w-7 h-7 bg-white rounded-full border border-blue-200 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
            </div>
            <div>
                    <h3 class="text-sm font-semibold text-blue-900">Our Service Promise</h3>
                    <ul class="mt-1 space-y-1 text-xs text-blue-800">
                      <li class="flex items-start">
                        <svg class="h-3 w-3 text-blue-600 mr-1 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        30-minute courtesy call before pickup/delivery
                      </li>
                      <li class="flex items-start">
                        <svg class="h-3 w-3 text-blue-600 mr-1 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Professional handling of your laundry
                      </li>
                      <li class="flex items-start">
                        <svg class="h-3 w-3 text-blue-600 mr-1 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Real-time status updates throughout
                      </li>
              </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Actions - Clean footer with distinct buttons -->
          <div class="mt-6 pt-4 border-t border-gray-200">
            <div class="flex flex-col sm:flex-row justify-between items-center">
              <div class="mb-4 sm:mb-0">
                <p class="text-xs text-gray-600 mb-0.5">
                  Need help with your order?
                </p>
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:123-456-7890" class="text-blue-600 font-medium hover:underline text-sm">123-456-7890</a>
                </div>
              </div>
              <div class="flex space-x-2">
                <a href="/" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7m-7-7v14" />
                  </svg>
                  Return Home
                </a>
                <a href="/account/orders" class="px-4 py-2 bg-blue-600 border border-blue-600 rounded-lg text-white text-sm font-medium hover:bg-blue-700 transition-colors flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  View All Orders
                </a>
              </div>
            </div>
        </div>
        </div>
      </div>
    </div>
  {/if}
</div> 

<!-- Login Modal -->
{#if showLoginModal}
  <LoginModal 
    on:close={closeLoginModal}
    on:success={handleLoginSuccess}
  />
{/if} 