<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchLocations, fetchServices } from '$lib/api';
  import { locations, services } from '$lib/stores';
  import ServiceCard from '$lib/components/ServiceCard.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import StepsSection from '$lib/components/StepsSection.svelte';
  import CommercialPreview from '$lib/components/CommercialPreview.svelte';
  import LocationsSection from '$lib/components/LocationsSection.svelte';
  
  onMount(async () => {
    await Promise.all([
      fetchLocations(),
      fetchServices()
    ]);
  });
</script>

<Hero />
<StepsSection />
<CommercialPreview />
<LocationsSection />
<!-- 
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
 -->




<style>
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
  }

  .animate-fade-in-up-delay {
    animation: fadeInUp 0.6s ease-out 0.2s forwards;
    opacity: 0;
  }

  .animate-fade-in-up-delay-2 {
    animation: fadeInUp 0.6s ease-out 0.4s forwards;
    opacity: 0;
  }

  .animate-fade-in-up-delay-3 {
    animation: fadeInUp 0.6s ease-out 0.6s forwards;
    opacity: 0;
  }

  .animate-fade-in {
    animation: fadeIn 1s ease-out forwards;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideIn {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }

  .animate-slide-in {
    animation: slideIn 4s linear infinite;
  }

  @keyframes bounceUp {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .animate-bounce-up {
    animation: bounceUp 2s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }

  @keyframes bubble {
    0% {
      transform: translateY(0) scale(1);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: translateY(-40px) scale(0.5);
      opacity: 0;
    }
  }

  .animate-bubble-1 {
    animation: bubble 2s ease-in-out infinite;
  }

  .animate-bubble-2 {
    animation: bubble 2s ease-in-out 0.6s infinite;
  }

  .animate-bubble-3 {
    animation: bubble 2s ease-in-out 1.2s infinite;
  }

  @keyframes vanMovement {
    0% { transform: translateX(0%); }
    40% { transform: translateX(45%); }
    45% { transform: translateX(45%); }
    85% { transform: translateX(100%); }
    100% { transform: translateX(100%); }
  }

  .animate-van-movement {
    animation: vanMovement 6s linear infinite;
  }

  @keyframes basketMove {
    0%, 39%, 86%, 100% { opacity: 1; transform: translateY(0); }
    40%, 85% { opacity: 0; transform: translateY(-20px); }
  }

  .animate-basket {
    animation: basketMove 6s linear infinite;
  }
</style>
