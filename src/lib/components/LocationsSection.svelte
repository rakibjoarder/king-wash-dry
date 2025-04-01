<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { locations } from '$lib/stores';
  import LocationCard from './LocationCard.svelte';

  interface Location {
    id: number;
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    hours: string;
  }

  let currentCityIndex = 0;
  let cities: string[] = [];
  let isReady = false;
  let currentCity = '';
  let groupedLocations: Record<string, Location[]> = {};
  
  // Group locations by city when the store updates
  $: {
    if ($locations && $locations.length > 0) {
      groupedLocations = $locations.reduce((acc: Record<string, Location[]>, location: Location) => {
        const city = location.city.toLowerCase();
        if (!acc[city]) {
          acc[city] = [];
        }
        acc[city].push(location);
        return acc;
      }, {});
      
      cities = Object.keys(groupedLocations).map(city => 
        city.charAt(0).toUpperCase() + city.slice(1)
      );

      // Initialize currentCity if not set
      if (!currentCity && cities.length > 0) {
        currentCity = cities[0];
      }
    }
  }
  
  onMount(() => {
    isReady = true;
    if (cities.length > 0) {
      startCityRotation();
    }
  });

  function startCityRotation() {
    function updateCity() {
      if (cities.length > 0) {
        currentCity = cities[currentCityIndex];
        currentCityIndex = (currentCityIndex + 1) % cities.length;
      }
    }

    updateCity(); // Initial update
    const timer = setInterval(updateCity, 2000);
    return () => clearInterval(timer);
  }

  function getLocationCount(city: string): number {
    return groupedLocations[city.toLowerCase()]?.length || 0;
  }

  function formatHours(hours: string): string {
    return hours;
  }

  function getMapsUrl(location: Location): string {
    const address = encodeURIComponent(`${location.address} ${location.city}, ${location.state} ${location.zip}`);
    return `https://www.google.com/maps/search/?api=1&query=${address}`;
  }
</script>

<section class="py-12 bg-gradient-to-b from-white to-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-8">
      <div class="flex flex-col items-center justify-center gap-2">
        <p class="text-2xl text-gray-700 flex items-center">
          <span>We are available in&nbsp;</span>
          <span class="relative inline-block w-[140px] -mt-8"> <!-- Fixed width container -->
            {#key currentCity}
              <span 
                in:fly={{ y: 20, duration: 300 }}
                out:fly={{ y: -20, duration: 300 }}
                class="text-blue-600 absolute left-0 whitespace-nowrap font-semibold"
                style="transform-origin: left center;"
              >
                {currentCity || '...'}
              </span>
            {/key}
          </span>
        </p>

        <p class="text-lg text-gray-600 mt-2">
          Open 7 days a week including holidays!
        </p>
      </div>
    </div>

    <!-- Location Cards -->
    {#if $locations && $locations.length > 0}
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {#each Object.entries(groupedLocations) as [city, cityLocations], cityIndex}
          <div
            in:fly={{ y: 20, duration: 400, delay: cityIndex * 200 }}
            class="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div class="bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2">
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-semibold text-white">
                  {city.charAt(0).toUpperCase() + city.slice(1)}
                </h3>
                <span class="text-sm text-white/90">
                  {getLocationCount(city)} {getLocationCount(city) === 1 ? 'location' : 'locations'}
                </span>
              </div>
            </div>
            
            <div class="divide-y divide-gray-100">
              {#each cityLocations as location}
                <LocationCard {location} />
              {/each}
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="text-center text-gray-500">
        Loading locations...
      </div>
    {/if}
  </div>
</section>

<style>
  :global(.location-card-enter) {
    opacity: 0;
    transform: translateY(20px);
  }
  :global(.location-card-enter-active) {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 500ms, transform 500ms;
  }
</style> 
