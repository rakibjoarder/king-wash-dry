<script>
  const currentYear = new Date().getFullYear();
  
  const services = [
    'Wash & Fold',
    'Dry Cleaning',
    'Commercial Laundry',
    'Pickup & Delivery'
  ];

  const socials = [
    { name: 'Facebook', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z', href: 'https://facebook.com' },
    { name: 'Instagram', icon: 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z', href: 'https://instagram.com' },
    { name: 'Twitter', icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z', href: 'https://twitter.com' }
  ];

  // Add commercial services
  const commercialServices = [
    'Hotels & Motels',
    'Restaurants',
    'Healthcare Facilities',
    'Fitness Centers',
    'Educational Institutions'
  ];
</script>

<footer class="bg-gray-900 text-white">
  <!-- Commercial Banner -->
  <div class="bg-blue-600 py-4">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 class="text-lg font-semibold">Looking for Commercial Laundry Solutions?</h4>
          <p class="text-white/90">Get customized service plans for your business</p>
        </div>
        <a 
          href="tel:+19453355112"
          class="inline-flex items-center px-6 py-2 bg-white text-blue-600 rounded-full font-medium hover:bg-blue-50 transition-colors duration-300 shadow-sm hover:shadow-md"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
          </svg>
          Call for Business Quote
        </a>
      </div>
    </div>
  </div>

  <!-- Main Footer -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      <!-- Company Info -->
      <div class="space-y-4 md:col-span-1">
        <!-- Logo and Company Name -->
        <div class="flex items-center space-x-3">
          <img 
            src="/images/logo.png" 
            alt="King Wash & Dry Logo" 
            class="h-20 w-auto"
          />
          <div>
            <h3 class="text-xl font-bold">King Wash & Dry</h3>
            <p class="text-sm text-gray-400">Professional Laundry Services</p>
          </div>
        </div>
        
        <p class="text-gray-400">Professional laundry services in the Dallas-Fort Worth area.</p>
        <div class="flex space-x-4">
          {#each socials as social}
            <a 
              href={social.href}
              class="text-gray-400 hover:text-white transition-colors duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d={social.icon}/>
              </svg>
            </a>
          {/each}
        </div>
      </div>

      <!-- Services - 2nd column -->
      <div>
        <h3 class="text-lg font-semibold mb-4">Our Services</h3>
        <ul class="space-y-2">
          {#each services as service}
            <li class="text-gray-400">{service}</li>
          {/each}
        </ul>
        
        <!-- Add Commercial Services Box -->
        <div class="mt-6 p-4 bg-gray-800 rounded-lg">
          <h4 class="text-lg font-semibold mb-3">Commercial Services</h4>
          <ul class="grid grid-cols-1 gap-2">
            {#each commercialServices as service}
              <li class="text-sm text-gray-400 flex items-center">
                <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                {service}
              </li>
            {/each}
          </ul>
          <div class="mt-4">
            <a 
              href="mailto:kingwashanddry07@gmail.com?subject=Commercial%20Service%20Inquiry"
              class="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-300 flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
              Request Commercial Quote
            </a>
          </div>
        </div>
      </div>

      <!-- Business Hours - 3rd column -->
      <div>
        <h3 class="text-lg font-semibold mb-4">Business Hours</h3>
        <ul class="space-y-3 text-sm text-gray-400">
          <li class="flex items-start">
            <svg class="w-5 h-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p class="font-medium">Monday - Friday:</p>
              <p>7:00 AM - 9:00 PM</p>
            </div>
          </li>
          <li class="flex items-start">
            <svg class="w-5 h-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p class="font-medium">Saturday:</p>
              <p>8:00 AM - 8:00 PM</p>
            </div>
          </li>
          <li class="flex items-start">
            <svg class="w-5 h-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p class="font-medium">Sunday:</p>
              <p>9:00 AM - 6:00 PM</p>
            </div>
          </li>
        </ul>
        
        <div class="mt-6 p-4 bg-gray-800 rounded-lg">
          <h4 class="text-lg font-semibold mb-3">Service Area</h4>
          <p class="flex items-center text-gray-400">
            <svg class="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            Dallas-Fort Worth Area
          </p>
        </div>
      </div>

      <!-- Contact Info - 4th column -->
      <div>
        <h3 class="text-lg font-semibold mb-4">Contact Us</h3>
        <div class="space-y-3">
          <p class="flex items-center text-gray-400 hover:text-white transition-colors duration-300">
            <svg class="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <a href="mailto:kingwashanddry07@gmail.com">
              kingwashanddry07@gmail.com
            </a>
          </p>
          <p class="flex items-center text-gray-400 hover:text-white transition-colors duration-300">
            <svg class="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            <a href="tel:+19453355112">
              +1 (945) 335-5112
            </a>
          </p>
          <div class="flex text-gray-400">
            <svg class="w-5 h-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <div>
              <p class="font-medium">Corporate Office:</p>
              <p class="text-sm">100 N Central Expy, Suite 812</p>
              <p class="text-sm">Richardson, TX 75080</p>
              <p class="text-sm">United States</p>
              <a 
                href="http://google.com/maps/search/?api=1&query=100+N+Central+Expy+Suite+812,+Richardson,+TX+75080" 
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-400 hover:text-blue-300 text-sm inline-flex items-center mt-1"
              >
                <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View on Map
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Bottom Bar -->
  <div class="bg-gray-950 py-4">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
        <p class="text-sm text-gray-400">
          &copy; {currentYear} King Wash & Dry. All rights reserved.
        </p>
        <div class="flex items-center space-x-2 text-sm text-gray-400">
          <span>Developed by</span>
          <a 
            href="https://www.facebook.com/smislammumin" 
            class="text-blue-400 hover:text-blue-300 transition-colors duration-300 font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            S M Islam
          </a>
        </div>
      </div>
    </div>
  </div>
</footer> 