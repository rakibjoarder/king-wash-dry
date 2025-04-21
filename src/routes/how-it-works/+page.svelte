<script lang="ts">
  import { onMount } from 'svelte';
  
  let stepsContainer: HTMLElement;
  let revealed = [false, false, false, false];
  
  const steps = [
    {
      number: 1,
      title: "Schedule",
      description: "Book your laundry service in seconds through our website. Choose your preferred pickup time and any special handling instructions for your garments.",
      icon: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM13 12H16V14H11V7H13V12Z"/></svg>`,
      image: "/images/schedule-laundr.png"
    },
    {
      number: 2,
      title: "Collection",
      description: "Our team arrives at your doorstep, right on schedule. We handle your garments with care and provide digital tracking for peace of mind.",
      icon: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 19V9.79318L12 4.79318L5 9.79318V19H19ZM21 21H3V8.5L12 2.5L21 8.5V21ZM7 11H9V13H7V11ZM15 11H17V13H15V11ZM11 11H13V13H11V11Z"/></svg>`,
      image: "/images/collection-laundry.png"
    },
    {
      number: 3,
      title: "Wash & Fold",
      description: "Using premium eco-friendly detergents and state-of-the-art equipment, we treat each garment according to its care label. Expert pressing and precise folding included.",
      icon: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M14.5 7.5C14.5 6.11929 13.3807 5 12 5C10.6193 5 9.5 6.11929 9.5 7.5C9.5 8.88071 10.6193 10 12 10C13.3807 10 14.5 8.88071 14.5 7.5ZM7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5ZM9 17H3V15H9V17ZM13 17H11V15H13V17ZM21 17H15V15H21V17ZM3 13H21V21H3V13Z"/></svg>`,
      image: "/images/washing-laundry.png"
    },
    {
      number: 4,
      title: "Return",
      description: "Your freshly cleaned clothes delivered back to you, professionally packed and ready to wear. Track your delivery in real-time through our website.",
      icon: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13 16.1716L19.0711 10.1005L20.4853 11.5147L12 20L3.51472 11.5147L4.92893 10.1005L11 16.1716V2H13V16.1716Z"/></svg>`,
      image: "/images/return.png"
    }
  ];

  const features = [
    {
      title: "Free Collection & Delivery",
      icon: `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>`
    },
    {
      title: "24/7 Customer Support",
      icon: `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>`
    },
    {
      title: "Live Order Updates",
      icon: `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>`
    }
  ];

  onMount(() => {
    animateSteps();
  });

  function animateSteps() {
    revealed.forEach((_, index) => {
      setTimeout(() => {
        revealed[index] = true;
        revealed = revealed; // Trigger reactivity
      }, index * 150);
    });
  }
</script>

<svelte:head>
  <title>How It Works | King Wash & Dry</title>
  <meta name="description" content="Learn about our laundry service process from scheduling to delivery." />
</svelte:head>

<section class="py-14 bg-white relative">
  <!-- Background Image -->
  <div class="absolute inset-0 opacity-5 z-0">
    <img src="/images/happy-customer.png" alt="Background" class="w-full h-full object-cover object-center" />
  </div>
  
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <!-- Header -->
    <div class="text-center mb-10">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">How It Works</h1>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        Our simple 4-step process makes laundry day a breeze. From scheduling to delivery, we've got you covered.
      </p>
    </div>
    
    <!-- Process Steps with Images -->
    <div bind:this={stepsContainer} class="relative mb-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {#each steps as step, i}
          <div 
            class="flex flex-col items-center transition-all duration-500 ease-out opacity-0 transform translate-y-4"
            class:opacity-100={revealed[i]} 
            class:translate-y-0={revealed[i]}
          >
            <!-- Image -->
            <div class="w-full h-64 rounded-lg overflow-hidden shadow-md mb-5 relative">
              <img 
                src={step.image} 
                alt={step.title} 
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <!-- Step Number -->
              <div class="absolute top-4 right-4 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {step.number}
              </div>
            </div>
            
            <!-- Title and description -->
            <div class="text-center px-2">
              <div class="flex items-center justify-center mb-3">
                <span class="text-blue-600 mr-2">{@html step.icon}</span>
                <h2 class="text-2xl font-bold text-gray-900">{step.title}</h2>
              </div>
              <p class="text-gray-600 text-base leading-relaxed">{step.description}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
    
    <!-- Additional Info Section -->
    <div class="bg-blue-50 rounded-xl p-8 mb-16">
      <h2 class="text-2xl font-bold text-center mb-6">Why Choose Our Laundry Service?</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        {#each features as feature}
          <div class="flex flex-col items-center text-center">
            <div class="flex-shrink-0 h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white mb-4">
              {@html feature.icon}
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
            <p class="text-gray-600">
              {#if feature.title === "Free Collection & Delivery"}
                We'll pick up and deliver your laundry at no extra charge. No minimum order required.
              {:else if feature.title === "24/7 Customer Support"}
                Our dedicated team is available around the clock to assist you with any questions or concerns.
              {:else}
                Track your laundry in real-time through our app or website. Know exactly when your clothes will arrive.
              {/if}
            </p>
          </div>
        {/each}
      </div>
    </div>
    
    <!-- Call to Action -->
    <div class="text-center mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
      <p class="text-xl text-gray-600 mb-8">Join thousands of satisfied customers who've reclaimed their time by using our service.</p>
      <a href="/order" class="inline-flex items-center px-8 py-4 text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-300">
        Schedule Your First Pickup
        <svg class="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
        </svg>
      </a>
    </div>
  </div>
</section>

<style>
  /* Animation classes */
  .translate-y-4 {
    transform: translateY(1rem);
  }
  
  .translate-y-0 {
    transform: translateY(0);
  }
  
  .opacity-0 {
    opacity: 0;
  }
  
  .opacity-100 {
    opacity: 1;
  }
</style> 