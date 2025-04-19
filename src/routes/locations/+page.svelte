<script lang="ts">
  import { onMount } from 'svelte';
  import { locations } from '$lib/stores';
  import { writable, type Writable } from 'svelte/store';
  import type { Location } from '$lib/types';
  
  let searchQuery = '';
  let filteredLocations: Writable<Location[]> = writable([]);
  let cities: string[] = [];
  let selectedCity = ''; // No default city filter
  
  // Function to filter locations based on search query
  function filterLocations() {
    if (!searchQuery.trim() && !selectedCity) {
      $filteredLocations = $locations;
      return;
    }
    
    let filtered = [...$locations];
    
    // Filter by selected city
    if (selectedCity) {
      filtered = filtered.filter(location => 
        location.city.toLowerCase() === selectedCity.toLowerCase()
      );
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(location => 
        location.name.toLowerCase().includes(query) ||
        location.address.toLowerCase().includes(query) ||
        location.city.toLowerCase().includes(query) ||
        location.state.toLowerCase().includes(query) ||
        location.zip.toLowerCase().includes(query)
      );
    }
    
    $filteredLocations = filtered;
  }
  
  // Initialize filtered locations and extract city list
  $: {
    if ($locations && $locations.length > 0) {
      // Extract unique cities
      const citySet = new Set<string>();
      $locations.forEach(location => citySet.add(location.city));
      cities = Array.from(citySet).sort();
      
      // Initialize with all locations
      $filteredLocations = $locations;
    }
  }
  
  // Update filtered locations whenever search query or selected city changes
  $: {
    if ($locations && (searchQuery !== undefined || selectedCity !== undefined)) {
      filterLocations();
    }
  }
  
  function selectCity(city: string) {
    selectedCity = city === selectedCity ? '' : city;
    filterLocations();
  }
</script>

<svelte:head>
  <title>King Wash & Dry - Locations</title>
</svelte:head>

<div class="bg-gray-50 min-h-screen">
  <!-- Page header with video background -->
  <div class="relative min-h-[350px] overflow-hidden">
    <!-- Video Background -->
    <div class="absolute inset-0 w-full h-full">
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-blue-black/70 to-black-800/60 z-10"></div>
      <iframe
        src="https://player.vimeo.com/video/1076965974?background=1&autoplay=1&muted=1&loop=1&byline=0&title=0"
        style="position: absolute; top: 50%; left: 50%; width: 177.77777778vh; min-width: 100%; height: 56.25vw; min-height: 100%; transform: translate(-50%, -50%); pointer-events: none;"
        frameborder="0"
        allow="autoplay; fullscreen"
        allowfullscreen={true}
        loading="lazy"
        title="Background Video"
      ></iframe>
    </div>
    
    <!-- Content overlay -->
    <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 h-full flex flex-col justify-center">
      <h1 class="text-3xl sm:text-5xl font-bold text-white mb-6">Find a Location Near You</h1>
      <p class="text-xl text-blue-100 max-w-2xl mb-10">
        We have multiple convenient locations to serve you. Visit us in-store or schedule a pickup for convenient laundry service.
      </p>
      
      <!-- Search box -->
      <div class="max-w-xl">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="relative flex-grow">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              bind:value={searchQuery}
              placeholder="Enter your city" 
              class="block w-full pl-10 pr-3 py-3 border border-transparent rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/20 transition-all duration-200"
            >
          </div>
          <button 
            on:click={filterLocations}
            class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-blue-800 bg-white hover:bg-blue-50 transition-colors duration-200 shadow-lg">
            Find Stores
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
    <!-- City tabs -->
    <div class="mb-8 overflow-x-auto">
      <div class="flex space-x-2 min-w-max">
        <button 
          on:click={() => { selectedCity = ''; filterLocations(); }}
          class={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${!selectedCity ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          All Cities
        </button>
        {#each cities as city}
          <button 
            on:click={() => selectCity(city)}
            class={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${selectedCity === city ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {city}
          </button>
        {/each}
      </div>
    </div>
    
    <!-- Results summary -->
    <div class="mb-8">
      <p class="text-gray-700">
        {#if searchQuery || selectedCity}
          {#if $filteredLocations.length === 0}
            No locations found matching your criteria.
          {:else}
            Showing {$filteredLocations.length} location{$filteredLocations.length !== 1 ? 's' : ''}
            {#if selectedCity} in {selectedCity}{/if}
            {#if searchQuery} matching "{searchQuery}"{/if}
          {/if}
        {:else}
          Showing all {$filteredLocations.length} locations
        {/if}
      </p>
    </div>
    
    <!-- Location cards grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#if $filteredLocations.length === 0}
        <div class="col-span-3 py-16 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="mt-2 text-lg font-medium text-gray-900">No locations found</h3>
          <p class="mt-1 text-gray-500">Try adjusting your search or selecting a different city.</p>
          <div class="mt-6">
            <button 
              on:click={() => { searchQuery = ''; selectedCity = ''; filterLocations(); }}
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Show all locations
            </button>
          </div>
        </div>
      {:else}
        {#each $filteredLocations as location}
          <div class="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl duration-300">
            <div class="h-48 overflow-hidden relative">
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(`${location.address}, ${location.city}, ${location.state} ${location.zip}`)}`}
                class="w-full h-full border-0"
                allowfullscreen={true}
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                title={`Map of ${location.name}`}
              ></iframe>
              <div class="absolute bottom-4 left-4 z-10">
                <span class="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full shadow-md">
                  {location.city}
                </span>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">{location.name}</h3>
              <p class="text-gray-500 mb-4">
                {location.address}, {location.city}, {location.state} {location.zip}
              </p>
              <div class="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-gray-700 text-sm">{location.hours}</span>
              </div>
              <div class="flex flex-wrap gap-2 mb-6">
               
                
                {#each ['Wash & Fold', 'Self-Service'] as service}
                  <span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {service}
                  </span>
                {/each}
                <span 
                on:click={() => { window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.address}, ${location.city}, ${location.state} ${location.zip}`)}`, '_blank'); }}
                class="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full cursor-pointer flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Navigate
                </span>

              </div>
             
            </div>
          </div>
        {/each}
      {/if}
    </div>
    
    <!-- Corporate Office Section -->
    <div class="mt-16 mb-16 bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="grid grid-cols-1 md:grid-cols-2">
        <!-- Map on the left -->
        <div class="h-full min-h-[300px] overflow-hidden relative">
          <iframe
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=100+N+Central+Expy+Suite+812,+Richardson,+TX+75080"
            class="w-full h-full border-0"
            allowfullscreen={true}
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Map of Corporate Office"
          ></iframe>
        </div>
        
        <!-- Corporate information on the right -->
        <div class="p-8 flex flex-col justify-center">
          <div class="inline-block px-4 py-2 bg-blue-100 text-blue-800 text-sm font-bold rounded-full mb-4">
            Corporate Headquarters
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">King Wash & Dry Corporate Office</h3>
          <div class="space-y-3 text-gray-700">
            <p class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>
                100 N Central Expy<br />
                Suite 812<br />
                Richardson TX 75080<br />
                United States<br />
                <span class="text-sm text-gray-500 mt-1 block">(Chase Building 75 & Beltline Rd)</span>
              </span>
            </p>
            <p class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Monday - Friday: 9:00 AM - 5:00 PM</span>
            </p>
            <button 
              on:click={() => { window.open('https://www.google.com/maps/search/?api=1&query=100+N+Central+Expy+Suite+812,+Richardson,+TX+75080', '_blank'); }}
              class="mt-6 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Get Directions
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Help section -->
    <div class="mt-16 bg-blue-50 rounded-xl p-8 shadow-sm">
      <div class="flex flex-col md:flex-row items-center justify-between">
        <div class="mb-6 md:mb-0">
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Need help finding a location?</h3>
          <p class="text-gray-600">Contact our support team and we'll help you find the nearest store.</p>
        </div>
        <a href="/contact" class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-md">
          Contact Us
        </a>
      </div>
    </div>
  </div>
</div>

<style>
  /* Add to ensure video is properly styled */
  iframe {
    object-fit: cover;
  }
</style> 