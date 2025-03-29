<script>
    import { onMount } from 'svelte';
    let activeStep = null;
    let stepsContainer;
    let revealed = [false, false, false, false];
    
    const steps = [
      {
        number: 1,
        title: "Schedule",
        description: "Book your laundry service in seconds through our website. Choose your preferred pickup time and any special handling instructions.",
        icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`,
        image: "https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
      },
      {
        number: 2,
        title: "Collection",
        description: "Our professional team arrives at your doorstep, right on schedule. We handle your garments with care and provide digital tracking for peace of mind.",
        icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>`,
        image: "https://images.unsplash.com/photo-1623110533424-0489a0b26251?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
      },
      {
        number: 3,
        title: "Wash & Fold",
        description: "Using premium eco-friendly detergents and state-of-the-art equipment, we treat each garment according to its care label. Expert pressing and precise folding included.",
        icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
        </svg>`,
        image: "https://images.unsplash.com/photo-1521656693074-0ef32e80a5d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
      },
      {
        number: 4,
        title: "Return",
        description: "Your freshly cleaned clothes are delivered back to you, professionally packed and ready to wear. Track your delivery in real-time through our website.",
        icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
        </svg>`,
        image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
      }
    ];

    onMount(() => {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          animateSteps();
        }
      }, { threshold: 0.2 });

      if (stepsContainer) {
        observer.observe(stepsContainer);
      }
    });

    function animateSteps() {
      revealed.forEach((_, index) => {
        setTimeout(() => {
          revealed[index] = true;
          revealed = revealed; // Trigger reactivity
        }, index * 500); // 500ms delay between each step
      });
    }
  </script>
  
  <section class="relative  overflow-hidden" style="color: #1E3A8A;">
    <!-- Background Image -->
    <div class="absolute top-0 -right-44  h-full">
      <img 
        src="/images/happy-customer.png" 
        alt="Happy customer with folded laundry giving thumbs up" 
        class="w-full h-full object-cover object-right"
      />
      <!-- Add a subtle overlay to ensure text remains readable -->
      <div class="absolute inset-0 bg-[#FFF3E0]/5"></div>
    </div>
  
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
      <!-- Header -->
      <div class="max-w-xl mb-16">
        <h2 class="text-4xl md:text-5xl font-bold text-[#1E3A8A] mb-4">
          Take back your time.<br>
          Leave the laundry to us.
        </h2>
        <a href="#how-it-works" class="text-[#3B82F6] text-lg font-medium hover:text-[#1E3A8A] transition-colors duration-300 flex items-center">
          How it works 
          <svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
  
      <!-- Steps Cards -->
      <div 
        bind:this={stepsContainer}
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10 px-4 md:px-8"
      >
        {#each steps as step, i}
          <div 
            class="bg-white rounded-2xl p-8 shadow-sm transition-all duration-500 min-w-[280px] opacity-0 translate-y-8"
            class:opacity-100={revealed[i]}
            class:translate-y-0={revealed[i]}
            class:hover:shadow-xl={revealed[i]}
            on:mouseenter={() => activeStep = step.number}
            on:mouseleave={() => activeStep = null}
          >
            <div class="flex items-start gap-4 mb-6">
              <div class="w-12 h-12 flex items-center justify-center flex-shrink-0 text-[#3B82F6]">
                {@html step.icon}
              </div>
              <h3 class="text-xl font-semibold text-gray-900 pt-2">
                {step.title}
              </h3>
            </div>
            <p class="text-gray-600 text-base leading-relaxed">
              {step.description}
            </p>
          </div>
        {/each}
      </div>
  
      <!-- Features -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 relative z-10">
        <div class="flex items-center text-[#1E3A8A] bg-white/80 rounded-xl p-4">
          <svg class="w-8 h-8 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <div>
            <span class="font-medium block">Free Collection & Delivery</span>
            <span class="text-sm text-gray-600">No minimum order</span>
          </div>
        </div>
  
        <div class="flex items-center text-[#1E3A8A] bg-white/80 rounded-xl p-4">
          <svg class="w-8 h-8 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div>
            <span class="font-medium block">24/7 Customer Support</span>
            <span class="text-sm text-gray-600">Always here to help</span>
          </div>
        </div>
  
        <div class="flex items-center text-[#1E3A8A] bg-white/80 rounded-xl p-4">
          <svg class="w-8 h-8 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
          <div>
            <span class="font-medium block">Live Order Updates</span>
            <span class="text-sm text-gray-600">Track in real-time</span>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <style>
    @keyframes progress {
      0% { width: 0; }
      100% { width: 100%; }
    }

    .animate-progress {
      animation: progress 3s linear;
    }

    /* Add if you don't have @tailwindcss/aspect-ratio plugin */
    .aspect-w-4 {
      position: relative;
      padding-bottom: 75%;
    }
    
    .aspect-w-4 > * {
      position: absolute;
      height: 100%;
      width: 100%;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }

    /* Add these styles for smooth animations */
    .translate-y-8 {
      transform: translateY(2rem);
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