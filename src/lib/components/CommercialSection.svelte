<script>
  const industries = [
    {
      title: "Hospitality & Lodging",
      description: "Complete linen service for hotels, motels, and bed & breakfasts",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    },
    {
      title: "Healthcare Facilities",
      description: "Specialized cleaning for medical linens and uniforms",
      icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
    },
    {
      title: "Fitness Centers",
      description: "Regular towel and gym equipment cleaning service",
      icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    },
    {
      title: "Restaurants & Cafes",
      description: "Professional cleaning for linens, uniforms, and kitchen textiles",
      icon: "M21 15.9A3.5 3.5 0 0018.5 14h-13A3.5 3.5 0 002 15.9V19h20v-3.1z"
    },
    {
      title: "Educational Institutions",
      description: "Comprehensive laundry solutions for schools and universities",
      icon: "M12 14l9-5-9-5-9 5 9 5z"
    },
    {
      title: "Corporate Offices",
      description: "Regular cleaning services for office linens and uniforms",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    }
  ];

  const features = [
    {
      title: "Flexible Scheduling",
      items: [
        "Daily service available",
        "Multiple pickups per week",
        "Weekly arrangements",
        "Bi-weekly schedules",
        "24/7 emergency service",
        "Holiday coverage"
      ]
    },
    {
      title: "Quality Assurance",
      items: [
        "State-of-the-art cleaning",
        "Eco-friendly detergents",
        "Rigorous quality control",
        "Customized care plans",
        "Stain treatment specialists",
        "Temperature-controlled storage"
      ]
    },
    {
      title: "Business Benefits",
      items: [
        "Volume discounts",
        "Dedicated account manager",
        "Monthly billing options",
        "Inventory management",
        "Regular service reports",
        "Cost optimization plans"
      ]
    },
    {
      title: "Premium Services",
      items: [
        "Express service available",
        "Specialized fabric care",
        "Custom packaging options",
        "RFID tracking system",
        "Digital inventory reports",
        "Satisfaction guarantee"
      ]
    }
  ];

  // Add the getIndustryImage function here
  function getIndustryImage(title) {
    const images = {
      "Hospitality & Lodging": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "Healthcare Facilities": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "Fitness Centers": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "Restaurants & Cafes": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "Educational Institutions": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "Corporate Offices": "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    };
    return images[title];
  }
</script>

<section class="py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
  <!-- Background Image Overlay -->
  <div class="absolute inset-0 opacity-[0.03] pointer-events-none">
    <img 
      src="https://images.unsplash.com/photo-1545173168-9f1947eebb7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
      alt="" 
      class="w-full h-full object-cover"
    />
  </div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
    <!-- Header with Side Image -->
    <div class="flex flex-col lg:flex-row items-center gap-12 mb-24">
      <div class="lg:w-1/2 text-left animate-fade-in">
        <div class="inline-flex items-center mb-6 animate-slide-up">
          <span class="px-6 py-2 rounded-full bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-600 text-sm font-semibold tracking-wider border border-blue-100/50 shadow-sm">
            Commercial Services
          </span>
        </div>
        <h2 class="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Commercial Laundry <span class="text-blue-600">Solutions</span>
        </h2>
        <p class="text-xl text-gray-600/90 leading-relaxed">
          Professional laundry services tailored for businesses of all sizes. Experience reliable, efficient, and customized solutions.
        </p>
      </div>
      <div class="lg:w-1/2 relative animate-fade-in" style="animation-delay: 200ms">
        <div class="relative rounded-2xl overflow-hidden shadow-2xl">
          <!-- Main Image -->
          <img 
            src="https://images.unsplash.com/photo-1545173168-9f1947eebb7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
            alt="Professional Laundry Service" 
            class="w-full h-[500px] object-cover"
          />
          
          <!-- Decorative Elements -->
          <div class="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-blue-600/10"></div>
          
          <!-- Floating Stats Box -->
          <div class="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg transform translate-y-0 hover:-translate-y-1 transition-all duration-300">
            <div class="grid grid-cols-3 gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600 mb-1">24/7</div>
                <div class="text-sm text-gray-600">Service</div>
              </div>
              <div class="text-center border-x border-gray-200">
                <div class="text-2xl font-bold text-blue-600 mb-1">100%</div>
                <div class="text-sm text-gray-600">Satisfaction</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600 mb-1">500+</div>
                <div class="text-sm text-gray-600">Clients</div>
              </div>
            </div>
          </div>

          <!-- Quality Badge -->
          <div class="absolute top-6 right-6 bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg flex items-center space-x-2">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-sm font-semibold text-gray-800">Premium Quality</span>
          </div>
        </div>

        <!-- Decorative Background Element -->
        <div class="absolute -z-10 top-8 right-8 w-full h-full rounded-2xl bg-blue-100/50"></div>
      </div>
    </div>

    <!-- Industries Grid with Image Backgrounds -->
    <div class="grid md:grid-cols-3 gap-8 mb-24">
      {#each industries as industry, i}
        <div 
          class="group relative rounded-2xl overflow-hidden h-[300px] animate-slide-up"
          style="animation-delay: {i * 100}ms"
        >
          <!-- Background Image -->
          <img 
            src={getIndustryImage(industry.title)} 
            alt={industry.title}
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <!-- Overlay -->
          <div class="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900/80 group-hover:via-gray-900/60 group-hover:to-gray-900/90 transition-all duration-500"></div>
          <!-- Content -->
          <div class="relative h-full p-8 flex flex-col justify-end">
            <div class="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d={industry.icon}/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">
              {industry.title}
            </h3>
            <p class="text-white/80 text-sm leading-relaxed">
              {industry.description}
            </p>
          </div>
        </div>
      {/each}
    </div>

    <!-- Enhanced Features Grid -->
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
      {#each features as feature, i}
        <div 
          class="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100/80 animate-slide-up relative overflow-hidden group"
          style="animation-delay: {(i * 150) + 500}ms"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative z-10">
            <div class="mb-8 pb-6 border-b border-gray-100">
              <h3 class="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                {feature.title}
              </h3>
            </div>
            <ul class="space-y-4">
              {#each feature.items as item}
                <li class="flex items-start text-gray-600 group/item">
                  <span class="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500/10 to-blue-600/10 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 group-hover/item:from-blue-500 group-hover/item:to-blue-600 transition-all duration-300">
                    <svg class="w-3.5 h-3.5 text-blue-600 group-hover/item:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </span>
                  <span class="text-sm leading-relaxed group-hover/item:text-gray-900 transition-colors duration-300">{item}</span>
                </li>
              {/each}
            </ul>
          </div>
        </div>
      {/each}
    </div>

    <!-- Enhanced CTA Section with Background Image -->
    <div class="relative rounded-3xl overflow-hidden animate-scale-up">
      <img 
        src="https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        alt=""
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-br from-blue-600/95 to-blue-700/95"></div>
      
      <div class="relative px-8 py-16">
        <div class="max-w-3xl mx-auto text-center">
          <h3 class="text-3xl font-bold text-white mb-6 [text-shadow:_0_1px_0_rgb(0_0_0_/_20%)]">
            Ready to Streamline Your Business Laundry?
          </h3>
          <p class="text-xl text-blue-100/90 mb-12 leading-relaxed">
            Contact us for a tailored quote and service plan that meets your specific needs
          </p>
          <div class="flex flex-col sm:flex-row gap-6 justify-center">
            <a 
              href="tel:+19453355112"
              class="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <svg class="w-5 h-5 mr-3 transform group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <span class="relative">
                Call for Quote
                <span class="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </span>
            </a>
            <a 
              href="mailto:kingwashanddry07@gmail.com"
              class="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-blue-600 transform hover:-translate-y-1 transition-all duration-300 group"
            >
              <svg class="w-5 h-5 mr-3 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <span class="relative">
                Email Us
                <span class="absolute -bottom-1 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slide-up {
    from { 
      transform: translateY(30px);
      opacity: 0;
    }
    to { 
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes scale-up {
    from { 
      transform: scale(0.95);
      opacity: 0;
    }
    to { 
      transform: scale(1);
      opacity: 1;
    }
  }

  .animate-fade-in {
    animation: fade-in 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  .animate-slide-up {
    animation: slide-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0;
  }

  .animate-scale-up {
    animation: scale-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  /* Add new smooth scroll behavior */
  html {
    scroll-behavior: smooth;
  }

  /* Enhanced background pattern */
  section {
    background-image: 
      radial-gradient(circle at 20% 20%, rgba(2, 132, 199, 0.03) 0%, transparent 40%),
      radial-gradient(circle at 80% 80%, rgba(2, 132, 199, 0.03) 0%, transparent 40%),
      linear-gradient(to right, rgba(2, 132, 199, 0.01), rgba(2, 132, 199, 0.02));
  }
</style> 