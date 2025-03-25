<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchLocations } from '$lib/api';
  import { locations } from '$lib/stores';
  import LocationCard from '$lib/components/LocationCard.svelte';
  
  onMount(async () => {
    await fetchLocations();
  });
</script>

<div class="bg-primary-700 text-white py-12">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-extrabold">Our Locations</h1>
    <p class="mt-4 text-xl">Find a King Wash & Dry location near you.</p>
  </div>
</div>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <div class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {#each $locations as location}
      <LocationCard {location} />
    {/each}
  </div>
</div> 