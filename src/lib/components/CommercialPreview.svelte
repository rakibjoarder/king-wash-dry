<script>
  import { goto } from '$app/navigation';

  const commercialFeatures = [
    {
      title: "Hotels & Healthcare",
      description: "Professional solutions for hospitality and medical facilities",
      image: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Restaurants & Cafes",
      description: "Keep your linens pristine and kitchen spotless",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Fitness Centers",
      description: "Fresh towels and clean gear for your facility",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];
</script>

<section class="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-blue-50 py-20">
  <!-- Removed background image and overlay -->

  <!-- Removed decorative elements -->

  <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Removed hero image -->

    <!-- Hero Section -->
    <div class="text-center mb-16 animate-slide-up">
      <span class="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold tracking-wider mb-4 animate-pulse">
        Business Solutions
      </span>
      <h2 class="text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
        Commercial Laundry Services
      </h2>
      <p class="max-w-2xl mx-auto text-lg text-gray-600 animate-fade-in-delay">
        Professional laundry solutions tailored for your business needs
      </p>
    </div>

    <!-- Cards Section -->
    <div class="grid md:grid-cols-3 gap-8 mb-16">
      {#each commercialFeatures as feature, i}
        <div 
          class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer border border-gray-100 relative animate-slide-up"
          on:click={() => goto('/commercial')}
          style="animation-delay: {i * 200}ms"
        >
          <div class="h-48 overflow-hidden">
            <img
              src={feature.image}
              alt={feature.title}
              class="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-700 group-hover:rotate-1"
            />
          </div>
          
          <div class="p-8 relative">
            <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 group-hover:translate-x-1">
              {feature.title}
            </h3>
            <p class="text-gray-600 group-hover:text-gray-700 transition-all duration-300 group-hover:translate-x-1">
              {feature.description}
            </p>
          </div>
        </div>
      {/each}
    </div>

    <!-- CTA Section -->
    <div class="relative rounded-3xl overflow-hidden animate-scale-up bg-gradient-to-r from-blue-600 to-blue-700">
      <div class="py-12 px-8 text-center text-white">
        <h3 class="text-2xl font-bold mb-4">Ready to Transform Your Business?</h3>
        <p class="mb-6 text-blue-100">Experience the difference with our commercial laundry services</p>
        <a 
          href="/commercial"
          class="inline-flex items-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-full hover:bg-blue-50 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Explore Commercial Services
          <svg class="ml-3 w-6 h-6 animate-bounce-horizontal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
          </svg>
        </a>
      </div>
    </div>
  </div>
</section>

<style>
  @keyframes bounceHorizontal {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(6px); }
  }

  @keyframes float-slow {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(10px, -10px); }
  }

  @keyframes float-medium {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(-15px, 15px); }
  }

  @keyframes float-fast {
    0%, 100% { transform: translate(-50%, -50%); }
    50% { transform: translate(-50%, -60%); }
  }

  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slide-up {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes scale-up {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  .animate-bounce-horizontal {
    animation: bounceHorizontal 1s infinite;
  }

  .animate-float-slow {
    animation: float-slow 6s ease-in-out infinite;
  }

  .animate-float-medium {
    animation: float-medium 5s ease-in-out infinite;
  }

  .animate-float-fast {
    animation: float-fast 4s ease-in-out infinite;
  }

  .animate-fade-in {
    animation: fade-in 1s ease-out forwards;
  }

  .animate-fade-in-delay {
    animation: fade-in 1s ease-out 0.3s forwards;
    opacity: 0;
  }

  .animate-slide-up {
    animation: slide-up 1s ease-out forwards;
    opacity: 0;
  }

  .animate-scale-up {
    animation: scale-up 1s ease-out forwards;
  }

  /* Enhanced hover transitions */
  .group:hover .group-hover\:scale-110 {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }

  .group:hover .group-hover\:translate-x-1 {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
</style> 