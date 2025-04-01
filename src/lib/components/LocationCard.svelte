<script lang="ts">
  import { fly } from 'svelte/transition';

  export let location: {
    id: number;
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    hours: string;
  };

  function getMapsUrl(location: typeof location): string {
    const address = encodeURIComponent(`${location.address} ${location.city}, ${location.state} ${location.zip}`);
    return `https://www.google.com/maps/search/?api=1&query=${address}`;
  }
</script>

<div class="p-3 hover:bg-blue-50 transition-colors duration-200">
  <div class="flex flex-col gap-2">
    <div>
      <p class="text-sm font-medium text-gray-900">{location.address}</p>
      <p class="text-xs text-gray-500 mt-0.5">{location.hours}</p>
      <p class="text-xs text-blue-600 mt-0.5">{location.phone}</p>
    </div>
    <a 
      href={getMapsUrl(location)}
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center justify-center w-full px-4 py-2 
             text-sm font-medium text-white bg-blue-600 
             hover:bg-blue-700 rounded-md transition-all duration-200 
             shadow-sm hover:shadow-md group"
    >
      <svg 
        class="w-5 h-5 mr-2 transition-transform duration-200 
               group-hover:scale-110" 
        viewBox="0 0 24 24" 
        fill="currentColor"
      >
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
      Open in Google Maps
      <svg 
        class="w-4 h-4 ml-1 transition-transform duration-200 
               group-hover:translate-x-1" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" 
              stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
      </svg>
    </a>
  </div>
</div> 