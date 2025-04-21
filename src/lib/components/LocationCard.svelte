<script lang="ts">
  export let location: {
    id: number;
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone?: string;
    image_url?: string;
    is_active?: boolean;
  };
  export let showNavigateButton = false;
  export let showMap = true;

  function getGoogleMapsUrl(address: string, city: string, state: string, zip: string) {
    const formattedAddress = encodeURIComponent(`${address}, ${city}, ${state} ${zip}`);
    return `https://www.google.com/maps/search/?api=1&query=${formattedAddress}`;
  }

  function getDirectionsUrl(address: string, city: string, state: string, zip: string) {
    const destination = encodeURIComponent(`${address}, ${city}, ${state} ${zip}`);
    return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
  }

  // Use a placeholder map image with a pin icon
  function getPlaceholderMapUrl() {
    return "/images/map-placeholder.png";
  }
  
  // Get a background color class based on city name
  function getCityColorClass(city: string): string {
    const cityColors: Record<string, string> = {
      'dallas': 'bg-blue-500',
      'mesquite': 'bg-teal-500',
      'garland': 'bg-indigo-500',
      'richardson': 'bg-cyan-600'
    };
    
    return cityColors[city.toLowerCase()] || 'bg-blue-500';
  }
</script>

<div class="flex flex-col h-full">
  <!-- Location image with city chip -->
  <div class="relative">
    {#if showMap && location.image_url}
      <div class="h-40 w-full">
        <img 
          src={location.image_url} 
          alt="Location at {location.address}" 
          class="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    {:else if showMap}
      <div class="h-40 w-full bg-gray-100 flex items-center justify-center">
        <div class="text-gray-400">
          <svg class="w-16 h-16 mx-auto" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      </div>
    {/if}
    
    <!-- City chip overlay -->
    <div class="absolute top-3 left-3">
      <div class="px-3 py-1 rounded-full text-sm font-medium text-white {getCityColorClass(location.city)} shadow-sm">
        {location.city}
      </div>
    </div>
    
    <!-- Closed indicator if not active -->
    {#if location.is_active === false}
      <div class="absolute top-3 right-3">
        <div class="px-2 py-1 rounded text-xs font-medium bg-gray-800 text-white shadow-sm">
          Closed
        </div>
      </div>
    {/if}
  </div>
  
  <!-- Content -->
  <div class="p-4 flex-1 flex flex-col">
    <!-- Location info -->
    <div class="mb-4 flex-1">
      <h3 class="text-lg font-bold text-gray-900 mb-1">{location.name}</h3>
      <p class="text-sm text-gray-700">{location.address}</p>
      <p class="text-sm text-gray-600">{location.city}, {location.state} {location.zip}</p>
      
      {#if location.phone}
        <a href="tel:{location.phone}" class="text-sm text-gray-700 hover:text-blue-600 transition-colors mt-2 block">
          <span class="inline-flex items-center">
            <svg class="w-4 h-4 mr-1.5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
            </svg>
            {location.phone}
          </span>
        </a>
      {/if}
    </div>

    <!-- Action links -->
    <div class="mt-2 flex items-center justify-end">
      <!-- Directions -->
      <a
        href={getDirectionsUrl(location.address, location.city, location.state, location.zip)}
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors" 
      >
        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21.71 11.29l-9-9a.996.996 0 00-1.41 0l-9 9a.996.996 0 000 1.41l9 9c.39.39 1.02.39 1.41 0l9-9a.996.996 0 000-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z"/>
        </svg>
        Directions
      </a>
    </div>
  </div>
</div> 