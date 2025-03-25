<script lang="ts">
  import type { Location } from '$lib/types';
  
  export let location: Location;
</script>

<div class="bg-white rounded-lg shadow-md overflow-hidden">
  <div class="p-6">
    <h3 class="text-lg font-semibold text-gray-900">{location.name}</h3>
    <p class="mt-2 text-gray-600">{location.address}</p>
    <p class="text-gray-600">{location.city}, {location.state} {location.zip}</p>
    <p class="mt-2 text-gray-600">Phone: {location.phone}</p>
    <p class="mt-2 text-gray-600">Hours: {location.hours}</p>
    <a 
      href="https://maps.google.com/?q={encodeURIComponent(`${location.address}, ${location.city}, ${location.state} ${location.zip}`)}" 
      target="_blank" 
      rel="noopener noreferrer"
      class="mt-4 inline-block text-primary-600 hover:text-primary-800"
    >
      View on Map
    </a>
  </div>
</div> 