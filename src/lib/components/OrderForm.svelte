<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchLocations, fetchServices, addOrder } from '$lib/api';
  import { locations, services, currentUser } from '$lib/stores';
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabase';
  import ServiceSelection from './ServiceSelection.svelte';
  import LaundryPreferences from './LaundryPreferences.svelte';
  import LocationCard from './LocationCard.svelte';
  import LoginModal from './LoginModal.svelte';
  
  interface Item {
    id: string;
    name: string;
    avgWeight: number;
    icon: string;
    quantity: number;
  }

  interface CustomerData {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    user_id?: string;
  }
  
  interface LaundryPreferencesType {
    waterTemperature: 'hot' | 'cold';
    dryingLevel: 'regular' | 'low';
    detergent: 'scented' | 'hypoallergenic';
    additionalServices: {
      babyCare: boolean;
      bleach: boolean;
      darkProtect: boolean;
      fabricSoftener: boolean;
      scentBooster: boolean;
      hangingService: boolean;
    };
    specialInstructions: string;
  }
  
  // Define item types
  const itemTypes = [
    { id: 'shirt', name: 'Shirts', avgWeight: 0.3, icon: 'shirt' },
    { id: 'pants', name: 'Pants/Jeans', avgWeight: 0.6, icon: 'pants' },
    { id: 'dress', name: 'Dresses', avgWeight: 0.5, icon: 'dress' },
    { id: 'sweater', name: 'Sweaters', avgWeight: 0.7, icon: 'sweater' },
    { id: 'jacket', name: 'Jackets', avgWeight: 1.0, icon: 'jacket' },
    { id: 'bedding', name: 'Bedding', avgWeight: 2.0, icon: 'bedding' },
    { id: 'towel', name: 'Towels', avgWeight: 0.5, icon: 'towel' },
    { id: 'other', name: 'Other Items', avgWeight: 0.5, icon: 'other' }
  ];
  
  // Items in the order
  let selectedItems: Item[] = itemTypes.map(item => ({
    ...item,
    quantity: 0
  }));
  
  // Add laundry preferences object with proper types
  let preferences: LaundryPreferencesType = {
    waterTemperature: 'cold',
    dryingLevel: 'regular',
    detergent: 'scented',
    additionalServices: {
      babyCare: false,
      bleach: false,
      darkProtect: false,
      fabricSoftener: false,
      scentBooster: false,
      hangingService: false
    },
    specialInstructions: ''
  };
  
  let formData = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    location_id: '',
    service_id: '',
    weight: 0,
    notes: '',
    pickup_requested: true,
    pickup_date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    drop_off_date: new Date().toISOString().split('T')[0], // Today
    service_type: ''
  };
  
  let loading = false;
  let success = false;
  let error = '';
  let manualWeightEntry = false;
  let showLoginModal = false;
  
  onMount(async () => {
    // Check if user is logged in
    const { data } = await supabase.auth.getSession();
    
    if (data.session) {
      currentUser.set(data.session.user);
      
      // Fetch customer data to pre-fill form
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', data.session.user.id)
        .single();
      
      if (!customerError && customerData) {
        // Pre-fill form with customer data
        formData.first_name = customerData.first_name || '';
        formData.last_name = customerData.last_name || '';
        formData.email = customerData.email || '';
        formData.phone = customerData.phone || '';
        formData.address = customerData.address || '';
        formData.city = customerData.city || '';
        formData.state = customerData.state || '';
        formData.zip = customerData.zip || '';
      }
    }
    
    await Promise.all([
      fetchLocations(),
      fetchServices()
    ]);
    
    // Default to first location if available
    if ($locations.length > 0) {
      formData.location_id = $locations[0].id.toString();
    }
    
    // Default to first service if available
    if ($services.length > 0) {
      formData.service_id = $services[0].id.toString();
    }
  });
  
  // Calculate estimated weight based on selected items
  $: {
    if (!manualWeightEntry) {
      formData.weight = selectedItems.reduce((total, item) => {
        return total + (item.quantity * item.avgWeight);
      }, 0);
      
      // Round to 1 decimal place
      formData.weight = Math.round(formData.weight * 10) / 10;
    }
  }
  
  function updateItemQuantity(itemId: string, change: number) {
    selectedItems = selectedItems.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(0, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
  }
  
  // Calculate estimated price including preferences costs
  function calculateEstimatedPrice() {
    const selectedService = $services.find(s => s.id.toString() === formData.service_id);
    if (!selectedService) return 0;
    
    // Get base price
    const basePrice = selectedService.price * formData.weight;
    
    // Calculate additional costs from preferences
    let additionalCosts = 0;
    
    // Hypoallergenic detergent costs extra
    if (preferences.detergent === 'hypoallergenic') {
      additionalCosts += 0.25 * formData.weight;
    }
    
    // Additional services
    if (preferences.additionalServices.babyCare) additionalCosts += 0.2 * formData.weight;
    if (preferences.additionalServices.bleach) additionalCosts += 0.2 * formData.weight;
    if (preferences.additionalServices.darkProtect) additionalCosts += 0.2 * formData.weight;
    if (preferences.additionalServices.fabricSoftener) additionalCosts += 0.2 * formData.weight;
    if (preferences.additionalServices.scentBooster) additionalCosts += 0.2 * formData.weight;
    
    // Hanging service is per item
    if (preferences.additionalServices.hangingService) {
      // Estimate number of items that would be hung
      const hangableItems = selectedItems
        .filter(item => ['shirt', 'dress', 'jacket', 'pants'].includes(item.id))
        .reduce((sum, item) => sum + item.quantity, 0);
      
      additionalCosts += hangableItems * 0.35;
    }
    
    return basePrice + additionalCosts;
  }
  
  // Add handleLoginSuccess function
  function handleLoginSuccess() {
    showLoginModal = false;
  }
  
  // Modify handleSubmit function to check login first
  async function handleSubmit() {
    // Check if user is logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      showLoginModal = true;
      return;
    }

    loading = true;
    error = '';
    success = false;
    
    try {
      // Validate form
      if (!formData.first_name || !formData.last_name || !formData.email || !formData.phone) {
        throw new Error('Please fill in all required fields');
      }
      
      if (formData.weight <= 0) {
        throw new Error('Please add items or enter a valid weight');
      }
      
      // Prepare item details for order notes
      const itemDetails = selectedItems
        .filter(item => item.quantity > 0)
        .map(item => `${item.quantity} ${item.name}`)
        .join(', ');
      
      // Add preferences to notes
      let preferencesText = `\n\nPreferences: ${preferences.waterTemperature} wash, ${preferences.dryingLevel} heat, ${preferences.detergent} detergent`;
      
      // Add additional services
      const additionalServices = Object.entries(preferences.additionalServices)
        .filter(([_, enabled]) => enabled)
        .map(([service]) => {
          // Convert camelCase to readable format
          return service.replace(/([A-Z])/g, ' $1').toLowerCase();
        });
      
      if (additionalServices.length > 0) {
        preferencesText += `\nAdditional services: ${additionalServices.join(', ')}`;
      }
      
      // Add special instructions
      if (preferences.specialInstructions) {
        preferencesText += `\nSpecial instructions: ${preferences.specialInstructions}`;
      }
      
      const orderNotes = formData.notes 
        ? `${formData.notes}\n\nItems: ${itemDetails}${preferencesText}` 
        : `Items: ${itemDetails}${preferencesText}`;
      
      // Get selected service price
      const selectedService = $services.find(s => s.id.toString() === formData.service_id);
      if (!selectedService) {
        throw new Error('Please select a valid service');
      }
      
      // Create customer data object
      const customerData: CustomerData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip
      };
      
      // Add user_id if user is logged in
      if ($currentUser) {
        customerData.user_id = $currentUser.id;
      }
      
      // Create order data object
      const orderData = {
        location_id: parseInt(formData.location_id),
        service_id: parseInt(formData.service_id),
        weight: formData.weight,
        notes: orderNotes,
        pickup_requested: formData.pickup_requested,
        pickup_date: formData.pickup_requested ? formData.pickup_date : null,
        drop_off_date: formData.drop_off_date
      };
      
      const order = await addOrder(customerData, orderData);
      
      success = true;
      
      // Reset form
      selectedItems = itemTypes.map(item => ({
        ...item,
        quantity: 0
      }));
      
      // Redirect to account page if logged in, otherwise show success message
      if ($currentUser) {
        setTimeout(() => {
          goto('/account');
        }, 2000);
      }
    } catch (err: unknown) {
      console.error('Error submitting order:', err);
      if (err instanceof Error) {
        error = err.message;
      } else {
        error = 'An error occurred while submitting your order. Please try again.';
      }
    } finally {
      loading = false;
    }
  }
  
  function getItemIcon(iconName: string): string {
    switch(iconName) {
      case 'shirt':
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 2L2 8l4 2m12-8l4 6-4 2M5 12v8a2 2 0 002 2h10a2 2 0 002-2v-8" /></svg>`;
      case 'pants':
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 6v12m6-12v12M9 6H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2h-2" /></svg>`;
      case 'dress':
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 4v12l-4 2-4-2V4M6 20h12" /></svg>`;
      case 'sweater':
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 6h-4V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4v14a2 2 0 002 2h12a2 2 0 002-2V6z" /></svg>`;
      case 'jacket':
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>`;
      case 'bedding':
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>`;
      case 'towel':
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>`;
      default:
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>`;
    }
  }
</script>

<div class="max-w-4xl mx-auto p-4 space-y-8">
  <!-- Service Type Selection -->
  <div>
    <h2 class="text-xl font-semibold mb-4">Select Service Type</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <button
        class="p-6 border rounded-lg text-left hover:border-blue-500 transition-all
          {formData.service_type === 'pickup_and_dropoff' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}"
        on:click={() => formData.service_type = 'pickup_and_dropoff'}
      >
        <div class="flex items-start">
          <svg class="w-6 h-6 text-blue-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
          </svg>
          <div class="ml-3">
            <h3 class="font-medium">Full Service</h3>
            <p class="text-sm text-gray-500">We'll pick up your laundry and deliver it back to you</p>
          </div>
        </div>
      </button>

      <button
        class="p-6 border rounded-lg text-left hover:border-blue-500 transition-all
          {formData.service_type === 'self_service' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}"
        on:click={() => formData.service_type = 'self_service'}
      >
        <div class="flex items-start">
          <svg class="w-6 h-6 text-blue-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"/>
          </svg>
          <div class="ml-3">
            <h3 class="font-medium">Self Service</h3>
            <p class="text-sm text-gray-500">Use our facilities to do your own laundry</p>
            <p class="text-xs text-blue-600 mt-1">Washers starting from $2.50 | Dryers starting from $2.00</p>
          </div>
        </div>
      </button>
    </div>
  </div>

  {#if formData.service_type === 'self_service'}
    <!-- Store Locations -->
    <div class="space-y-4">
      <h3 class="text-lg font-medium text-gray-900">Our Locations</h3>
      <p class="text-sm text-gray-500">Select a location to get directions</p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each $locations as location (location.id)}
          <LocationCard {location} />
        {/each}
      </div>
    </div>
  {:else if formData.service_type === 'pickup_and_dropoff'}
    <!-- Your existing pickup and delivery form code -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-6">Schedule a Laundry Pickup</h2>
      
      {#if success}
        <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          Your order has been successfully submitted! Our team will contact you to confirm the pickup details.
        </div>
      {/if}
      
      {#if error}
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      {/if}
      
      <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-medium mb-4">Contact Information</h3>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="first_name" class="block text-sm font-medium text-gray-700">First Name*</label>
                <input 
                  type="text" 
                  id="first_name" 
                  required
                  bind:value={formData.first_name}
                  class="input mt-1 block w-full"
                />
              </div>
              
              <div>
                <label for="last_name" class="block text-sm font-medium text-gray-700">Last Name*</label>
                <input 
                  type="text" 
                  id="last_name" 
                  required
                  bind:value={formData.last_name}
                  class="input mt-1 block w-full"
                />
              </div>
            </div>
            
            <div class="mt-4">
              <label for="email" class="block text-sm font-medium text-gray-700">Email*</label>
              <input 
                type="email" 
                id="email" 
                required
                bind:value={formData.email}
                class="input mt-1 block w-full"
              />
            </div>
            
            <div class="mt-4">
              <label for="phone" class="block text-sm font-medium text-gray-700">Phone*</label>
              <input 
                type="tel" 
                id="phone" 
                required
                bind:value={formData.phone}
                class="input mt-1 block w-full"
              />
            </div>
            
            <div class="mt-4">
              <label for="address" class="block text-sm font-medium text-gray-700">Address*</label>
              <input 
                type="text" 
                id="address" 
                required
                bind:value={formData.address}
                class="input mt-1 block w-full"
              />
            </div>
            
            <div class="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label for="city" class="block text-sm font-medium text-gray-700">City*</label>
                <input 
                  type="text" 
                  id="city" 
                  required
                  bind:value={formData.city}
                  class="input mt-1 block w-full"
                />
              </div>
              
              <div>
                <label for="state" class="block text-sm font-medium text-gray-700">State*</label>
                <input 
                  type="text" 
                  id="state" 
                  required
                  bind:value={formData.state}
                  class="input mt-1 block w-full"
                />
              </div>
            </div>
            
            <div class="mt-4">
              <label for="zip" class="block text-sm font-medium text-gray-700">ZIP Code*</label>
              <input 
                type="text" 
                id="zip" 
                required
                bind:value={formData.zip}
                class="input mt-1 block w-full"
              />
            </div>
          </div>
          
          <div>
            <h3 class="text-lg font-medium mb-4">Order Details</h3>
            
            <div>
              <label for="location" class="block text-sm font-medium text-gray-700">Preferred Location*</label>
              <select 
                id="location" 
                required
                bind:value={formData.location_id}
                class="input mt-1 block w-full"
              >
                {#each $locations as location}
                  <option value={location.id}>{location.name}</option>
                {/each}
              </select>
            </div>
            
            <div class="mt-4">
              <label for="service" class="block text-sm font-medium text-gray-700">Service*</label>
              <ServiceSelection bind:selectedServiceId={formData.service_id} />
            </div>
            
            <div class="mt-6">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Select Your Items*</h4>
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="grid grid-cols-1 gap-3">
                  {#each selectedItems as item}
                    <div class="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                      <div class="flex items-center">
                        <div class="w-8 h-8 flex items-center justify-center text-primary-600">
                          {@html getItemIcon(item.icon)}
                        </div>
                        <span class="ml-2 text-sm font-medium">{item.name}</span>
                        <span class="ml-2 text-xs text-gray-500">~{item.avgWeight} lbs each</span>
                      </div>
                      <div class="flex items-center">
                        <button 
                          type="button"
                          class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                          on:click={() => updateItemQuantity(item.id, -1)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                          </svg>
                        </button>
                        <span class="mx-3 w-6 text-center">{item.quantity}</span>
                        <button 
                          type="button"
                          class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                          on:click={() => updateItemQuantity(item.id, 1)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  {/each}
                </div>
                
                <div class="mt-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <input 
                        id="manual_weight" 
                        type="checkbox" 
                        bind:checked={manualWeightEntry}
                        class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      />
                      <label for="manual_weight" class="ml-2 text-sm text-gray-700">Enter weight manually</label>
                    </div>
                    <div class="text-sm font-medium">
                      Estimated Weight: {formData.weight} lbs
                    </div>
                  </div>
                  
                  {#if manualWeightEntry}
                    <div class="mt-2">
                      <input 
                        type="number" 
                        min="0.1"
                        step="0.1"
                        required
                        bind:value={formData.weight}
                        class="input block w-full"
                        placeholder="Enter weight in lbs"
                      />
                    </div>
                  {/if}
                </div>
                
                {#if formData.weight > 0 && formData.service_id}
                  <div class="mt-4 p-3 bg-primary-50 rounded-lg border border-primary-100">
                    <div class="flex justify-between items-center">
                      <span class="text-sm font-medium text-gray-700">Estimated Price:</span>
                      <span class="text-lg font-bold text-primary-700">${calculateEstimatedPrice().toFixed(2)}</span>
                    </div>
                  </div>
                {/if}
              </div>
            </div>
            
            <div class="mt-4">
              <label for="notes" class="block text-sm font-medium text-gray-700">Special Instructions</label>
              <textarea 
                id="notes" 
                rows="3"
                bind:value={formData.notes}
                class="input mt-1 block w-full"
                placeholder="Any special handling instructions or notes for our team"
              ></textarea>
            </div>
            
            <div class="mt-4">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input 
                    id="pickup" 
                    type="checkbox" 
                    bind:checked={formData.pickup_requested}
                    class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label for="pickup" class="font-medium text-gray-700">Request Pickup Service</label>
                  <p class="text-gray-500">Our team will pick up your laundry from your address</p>
                </div>
              </div>
            </div>
            
            {#if formData.pickup_requested}
              <div class="mt-4">
                <label for="pickup_date" class="block text-sm font-medium text-gray-700">Preferred Pickup Date*</label>
                <input 
                  type="date" 
                  id="pickup_date" 
                  required={formData.pickup_requested}
                  min={new Date().toISOString().split('T')[0]}
                  bind:value={formData.pickup_date}
                  class="input mt-1 block w-full"
                />
              </div>
            {/if}
          </div>
        </div>
        
        <!-- Laundry Preferences -->
        <LaundryPreferences bind:preferences={preferences} bind:weight={formData.weight} />
        
        <div class="flex justify-end">
          <button 
            type="submit" 
            disabled={loading || (!manualWeightEntry && selectedItems.every(item => item.quantity === 0))}
            class="btn btn-primary"
          >
            {#if loading}
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            {:else}
              Schedule Pickup
            {/if}
          </button>
        </div>
      </form>
    </div>
  {/if}
</div>

<!-- Add LoginModal at the bottom of the template -->
{#if showLoginModal}
  <LoginModal 
    on:close={() => showLoginModal = false}
    on:success={handleLoginSuccess}
  />
{/if} 