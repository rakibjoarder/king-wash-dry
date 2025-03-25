<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchServices } from '$lib/api';
  import { services } from '$lib/stores';
  import ServiceCard from '$lib/components/ServiceCard.svelte';
  
  onMount(async () => {
    await fetchServices();
  });
</script>

<div class="bg-primary-700 text-white py-12">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-extrabold">Our Services</h1>
    <p class="mt-4 text-xl">Professional laundry services to meet your needs.</p>
  </div>
</div>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <div class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {#each $services as service}
      <ServiceCard {service} />
    {/each}
  </div>
</div> 