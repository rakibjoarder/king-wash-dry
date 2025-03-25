<script lang="ts">
  import { locations } from '$lib/stores';
  import { onMount } from 'svelte';
  
  export let formData;
  
  // Calculate minimum dates for pickup and delivery
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const formatDate = (date) => date.toISOString().split('T')[0];
  
  // Minimum dates
  const minDropOffDate = formatDate(today);
  const minPickupDate = formatDate(tomorrow);
  
  // Calculate suggested dates (1 day from drop-off for pickup instead of 3)
  function getSuggestedPickupDate(dropOffDate) {
    const date = new Date(dropOffDate);
    date.setDate(date.getDate() + 1);
    return formatDate(date);
  }
  
  // Update pickup date when drop-off date changes
  $: if (formData.drop_off_date) {
    // Only auto-update if the current pickup date is before the new minimum
    const suggestedDate = getSuggestedPickupDate(formData.drop_off_date);
    const currentPickupDate = new Date(formData.pickup_date);
    const minPickupDateObj = new Date(formData.drop_off_date);
    minPickupDateObj.setDate(minPickupDateObj.getDate() + 1);
    
    if (currentPickupDate < minPickupDateObj) {
      formData.pickup_date = suggestedDate;
    }
  }
  
  // Format location display
  function getLocationDetails(locationId) {
    const location = $locations.find(loc => loc.id.toString() === locationId);
    return location ? location : null;
  }
  
  // Selected location
  $: selectedLocation = getLocationDetails(formData.location_id);
  
  // Time slots for drop-off and pickup
  const timeSlots = [
    { value: '08:00', label: '8:00 AM - 10:00 AM' },
    { value: '10:00', label: '10:00 AM - 12:00 PM' },
    { value: '12:00', label: '12:00 PM - 2:00 PM' },
    { value: '14:00', label: '2:00 PM - 4:00 PM' },
    { value: '16:00', label: '4:00 PM - 6:00 PM' },
    { value: '18:00', label: '6:00 PM - 8:00 PM' }
  ];
  
  // Initialize time slots if not set
  onMount(() => {
    if (!formData.drop_off_time) {
      formData.drop_off_time = '10:00';
    }
    if (!formData.pickup_time) {
      formData.pickup_time = '14:00';
    }
    
    // Always set pickup_requested to true since we're removing the toggle
    formData.pickup_requested = true;
  });
</script>

<div class="space-y-6">
  <div>
    <h3 class="text-lg font-medium mb-4">Delivery Details</h3>
    
    <!-- Personal Information -->
    <div class="bg-white p-5 rounded-lg border border-gray-200 mb-6">
      <h4 class="text-primary-700 font-medium mb-4">Personal Information</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="first_name" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input 
            type="text" 
            id="first_name" 
            bind:value={formData.first_name} 
            class="input w-full" 
            required
          />
        </div>
        <div>
          <label for="last_name" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input 
            type="text" 
            id="last_name" 
            bind:value={formData.last_name} 
            class="input w-full" 
            required
          />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            id="email" 
            bind:value={formData.email} 
            class="input w-full" 
            required
          />
        </div>
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input 
            type="tel" 
            id="phone" 
            bind:value={formData.phone} 
            class="input w-full" 
            required
          />
        </div>
      </div>
    </div>
    
    <!-- Address Information -->
    <div class="bg-white p-5 rounded-lg border border-gray-200 mb-6">
      <h4 class="text-primary-700 font-medium mb-4">Address Information</h4>
      <div class="space-y-4">
        <div>
          <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
          <input 
            type="text" 
            id="address" 
            bind:value={formData.address} 
            class="input w-full" 
            required
          />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="city" class="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input 
              type="text" 
              id="city" 
              bind:value={formData.city} 
              class="input w-full" 
              required
            />
          </div>
          <div>
            <label for="state" class="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input 
              type="text" 
              id="state" 
              bind:value={formData.state} 
              class="input w-full" 
              required
            />
          </div>
          <div>
            <label for="zip" class="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
            <input 
              type="text" 
              id="zip" 
              bind:value={formData.zip} 
              class="input w-full" 
              required
            />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Location Selection -->
    <div class="bg-white p-5 rounded-lg border border-gray-200 mb-6">
      <h4 class="text-primary-700 font-medium mb-4">Preferred Location</h4>
      <div class="grid grid-cols-1 gap-4">
        {#if $locations && $locations.length > 0}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {#each $locations as location}
              <div 
                class="border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md {formData.location_id === location.id.toString() ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}"
                on:click={() => formData.location_id = location.id.toString()}
              >
                <div class="flex items-center">
                  <div class="text-primary-500 mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-medium">{location.name}</h3>
                    <p class="text-sm text-gray-600">{location.address}</p>
                    <p class="text-sm text-gray-600">{location.city}, {location.state} {location.zip}</p>
                    <p class="text-xs text-primary-600 mt-1">Hours: {location.hours || '9:00 AM - 7:00 PM'}</p>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <p class="text-gray-500">No locations available</p>
        {/if}
      </div>
    </div>
    
    <!-- Schedule Information -->
    <div class="bg-white p-5 rounded-lg border border-gray-200">
      <h4 class="text-primary-700 font-medium mb-4">Schedule Information</h4>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Drop-off Section -->
        <div class="space-y-4">
          <h5 class="font-medium text-gray-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Drop-off Details
          </h5>
          
          <div>
            <label for="drop_off_date" class="block text-sm font-medium text-gray-700 mb-1">Drop-off Date</label>
            <div class="relative">
              <input 
                type="date" 
                id="drop_off_date" 
                bind:value={formData.drop_off_date} 
                min={minDropOffDate}
                class="input w-full pr-10" 
                required
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label for="drop_off_time" class="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
            <select 
              id="drop_off_time" 
              bind:value={formData.drop_off_time} 
              class="input w-full" 
              required
            >
              {#each timeSlots as slot}
                <option value={slot.value}>{slot.label}</option>
              {/each}
            </select>
          </div>
        </div>
        
        <!-- Pickup Section -->
        <div class="space-y-4">
          <h5 class="font-medium text-gray-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Pickup Details
          </h5>
          
          <div>
            <label for="pickup_date" class="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
            <div class="relative">
              <input 
                type="date" 
                id="pickup_date" 
                bind:value={formData.pickup_date} 
                min={formData.drop_off_date ? getSuggestedPickupDate(formData.drop_off_date) : minPickupDate}
                class="input w-full pr-10" 
                required
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label for="pickup_time" class="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
            <select 
              id="pickup_time" 
              bind:value={formData.pickup_time} 
              class="input w-full" 
              required
            >
              {#each timeSlots as slot}
                <option value={slot.value}>{slot.label}</option>
              {/each}
            </select>
          </div>
        </div>
      </div>
      
      <div class="mt-6">
        <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
        <textarea 
          id="notes" 
          bind:value={formData.notes} 
          rows="3" 
          class="input w-full" 
          placeholder="Any special instructions for pickup or delivery..."
        ></textarea>
      </div>
    </div>
  </div>
</div> 