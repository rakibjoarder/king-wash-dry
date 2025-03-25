<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchLocations, fetchServices } from '$lib/api';
  import { locations, services } from '$lib/stores';
  import ServiceCard from '$lib/components/ServiceCard.svelte';
  
  onMount(async () => {
    await Promise.all([
      fetchLocations(),
      fetchServices()
    ]);
  });
</script>

<div class="bg-primary-700 text-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
    <div class="text-center">
      <h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
        King Wash & Dry
      </h1>
      <p class="mt-6 max-w-2xl mx-auto text-xl">
        Professional laundry services in the Dallas-Fort Worth area.
      </p>
      <div class="mt-10 flex justify-center">
        <a href="/locations" class="btn btn-primary text-lg px-8 py-3 mr-4">Find a Location</a>
        <a href="/services" class="btn bg-white text-primary-700 hover:bg-gray-100 text-lg px-8 py-3">Our Services</a>
      </div>
    </div>
  </div>
</div>

<div class="bg-primary-50 py-12">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="lg:flex lg:items-center lg:justify-between">
      <div class="lg:w-1/2">
        <h2 class="text-3xl font-extrabold text-gray-900">
          Laundry Pickup & Delivery
        </h2>
        <p class="mt-3 max-w-md text-lg text-gray-500">
          No time to drop off your laundry? We'll come to you! Select your items, schedule a pickup, and our team will collect your laundry and deliver it back clean and folded.
        </p>
        <div class="mt-8">
          <a href="/order" class="btn btn-primary text-base font-medium px-6 py-3">
            Schedule a Pickup
          </a>
        </div>
      </div>
      <div class="mt-8 lg:mt-0 lg:w-1/2">
        <img class="rounded-lg shadow-xl" src="https://images.unsplash.com/photo-1582735689369-4fe89db7114c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Laundry delivery service">
      </div>
    </div>
  </div>
</div>

<section class="py-12 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center">
      <h2 class="text-3xl font-extrabold text-gray-900">Our Services</h2>
      <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
        We offer a variety of laundry services to meet your needs.
      </p>
    </div>
    
    <div class="mt-10 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {#each $services.slice(0, 3) as service}
        <ServiceCard {service} />
      {/each}
    </div>
    
    <div class="mt-10 text-center">
      <a href="/services" class="btn btn-primary">View All Services</a>
    </div>
  </div>
</section>

<section class="py-12 bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center">
      <h2 class="text-3xl font-extrabold text-gray-900">Why Choose King Wash & Dry?</h2>
    </div>
    
    <div class="mt-10 grid gap-8 grid-cols-1 md:grid-cols-3">
      <div class="text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-primary-600 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 class="mt-4 text-xl font-medium text-gray-900">Fast Turnaround</h3>
        <p class="mt-2 text-base text-gray-500">
          Get your laundry back quickly with our efficient service.
        </p>
      </div>
      
      <div class="text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-primary-600 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h3 class="mt-4 text-xl font-medium text-gray-900">Quality Care</h3>
        <p class="mt-2 text-base text-gray-500">
          We treat your clothes with the care they deserve.
        </p>
      </div>
      
      <div class="text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-primary-600 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 class="mt-4 text-xl font-medium text-gray-900">Affordable Pricing</h3>
        <p class="mt-2 text-base text-gray-500">
          Competitive rates without compromising on quality.
        </p>
      </div>
    </div>
  </div>
</section>

<section class="py-12 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center">
      <h2 class="text-3xl font-extrabold text-gray-900">Our Locations</h2>
      <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
        Find a King Wash & Dry location near you.
      </p>
    </div>
    
    <div class="mt-10 text-center">
      <p class="text-lg text-gray-600">We have 5 convenient locations across the Dallas-Fort Worth area.</p>
      <a href="/locations" class="mt-6 inline-block btn btn-primary">View All Locations</a>
    </div>
  </div>
</section>
