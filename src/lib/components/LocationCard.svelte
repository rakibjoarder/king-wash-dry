<script lang="ts">
  import { fly } from 'svelte/transition';

  export let location: {
    id: number;
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone?: string;
  };
  export let showNavigateButton = false;

  function getGoogleMapsUrl(address: string, city: string, state: string, zip: string) {
    const formattedAddress = encodeURIComponent(`${address}, ${city}, ${state} ${zip}`);
    return `https://www.google.com/maps/search/?api=1&query=${formattedAddress}`;
  }
</script>

<div class="bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md">
  <div class="space-y-3">
    <div class="text-gray-900">
      <p class="font-medium">{location.address}</p>
      <p class="text-sm text-gray-600">{location.city}, {location.state} {location.zip}</p>
    </div>

    {#if location.phone}
      <p class="text-sm text-gray-600">
        <a href="tel:{location.phone}" class="hover:text-blue-600 transition-colors">
          {location.phone}
        </a>
      </p>
    {/if}

    {#if showNavigateButton}
      <a
        href={getGoogleMapsUrl(location.address, location.city, location.state, location.zip)}
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center justify-center w-full px-4 py-2 
               text-sm font-medium text-white bg-blue-600 
               hover:bg-blue-700 rounded-md transition-all duration-200 
               shadow-sm hover:shadow-md group"
      >
        <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        Navigate
        <svg 
          class="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
        </svg>
      </a>
    {/if}
  </div>
</div> 