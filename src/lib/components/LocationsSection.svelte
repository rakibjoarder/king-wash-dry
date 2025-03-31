<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { onMount } from 'svelte';

  const locations = {
    dallas: [
      {
        address: '10100 Bruton Rd',
        city: 'Dallas',
        hours: '6 AM – 9 PM',
        maps_url: `https://www.google.com/maps/search/?api=1&query=10100+Bruton+Rd+Dallas`
      },
      {
        address: '9782 Forest Ln',
        city: 'Dallas',
        hours: '6 AM – 9 PM',
        maps_url: `https://www.google.com/maps/search/?api=1&query=9782+Forest+Ln+Dallas`
      },
      {
        address: '12309 N Plano Rd',
        city: 'Dallas',
        hours: '6 AM – 9 PM',
        maps_url: `https://www.google.com/maps/search/?api=1&query=12309+N+Plano+Rd+Dallas`
      },
      {
        address: '6556 Skillman St',
        city: 'Dallas',
        hours: '6 AM – 9 PM',
        maps_url: `https://www.google.com/maps/search/?api=1&query=6556+Skillman+St+Dallas`
      }
    ],
    garland: [
      {
        address: '3160 Saturn Rd',
        city: 'Garland',
        hours: '6 AM – 10 PM',
        maps_url: `https://www.google.com/maps/search/?api=1&query=3160+Saturn+Rd+Garland`
      },
      {
        address: '2425 W Walnut St',
        city: 'Garland',
        hours: '6 AM – 9 PM',
        maps_url: `https://www.google.com/maps/search/?api=1&query=2425+W+Walnut+St+Garland`
      }
    ],
    mesquite: [
      {
        address: '1820 Hillcrest St',
        city: 'Mesquite',
        hours: '6 AM – 9 PM',
        maps_url: `https://www.google.com/maps/search/?api=1&query=1820+Hillcrest+St+Mesquite`
      },
      {
        address: '3310 N Town E Blvd',
        city: 'Mesquite',
        hours: '6 AM – 10 PM',
        maps_url: `https://www.google.com/maps/search/?api=1&query=3310+N+Town+E+Blvd+Mesquite`
      }
    ],
    richardson: [
      {
        address: '1332 S Plano Rd',
        city: 'Richardson',
        hours: '6 AM – 9 PM',
        maps_url: `https://www.google.com/maps/search/?api=1&query=1332+S+Plano+Rd+Richardson`
      }
    ]
  };

  let currentCityIndex = 0;
  let cities = Object.keys(locations);
  let isReady = false;
  let currentCity = '';
  
  onMount(() => {
    isReady = true;
    startCityRotation();
  });

  function startCityRotation() {
    function updateCity() {
      const city = cities[currentCityIndex];
      currentCity = city.charAt(0).toUpperCase() + city.slice(1);
      currentCityIndex = (currentCityIndex + 1) % cities.length;
    }

    updateCity(); // Initial update
    const timer = setInterval(updateCity, 2000); // Change city every 2 seconds

    return () => clearInterval(timer);
  }

  function getLocationCount(city: string) {
    return locations[city].length;
  }
</script>

<section class="py-12 bg-gradient-to-b from-white to-gray-50">
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-8">
      <!-- Animated Text with Fixed Prefix and Transitioning City Names -->
      <div class="flex flex-col items-center justify-center gap-2">
        <p class="text-2xl text-gray-700 flex items-center">
          <span>We are available in&nbsp;</span>
          <span class="relative inline-block w-[140px] -mt-8"> <!-- Fixed width container -->
            {#key currentCity}
              <span 
                in:fly={{ y: 20, duration: 300 }}
                out:fly={{ y: -20, duration: 300 }}
                class="text-blue-600 absolute left-0 whitespace-nowrap font-semibold"
                style="transform-origin: left center;"
              >
                {currentCity}
              </span>
            {/key}
          </span>
        </p>

        <p class="text-lg text-gray-600 mt-2">
          Open 7 days a week including holidays!
        </p>
      </div>
    </div>

    <!-- Location Cards -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each Object.entries(locations) as [city, cityLocations], cityIndex}
        <div
          in:fly={{ y: 20, duration: 400, delay: cityIndex * 200 }}
          class="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div class="bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold text-white">
                {city.charAt(0).toUpperCase() + city.slice(1)}
              </h3>
              <span class="text-sm text-white/90">
                {getLocationCount(city)} {getLocationCount(city) === 1 ? 'location' : 'locations'}
              </span>
            </div>
          </div>
          
          <div class="divide-y divide-gray-100">
            {#each cityLocations as location}
              <div class="p-3 hover:bg-blue-50 transition-colors duration-200">
                <div class="flex justify-between items-start gap-2">
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">{location.address}</p>
                    <p class="text-xs text-gray-500 mt-0.5">{location.hours}</p>
                  </div>
                  <a 
                    href={location.maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center px-3 py-1.5 text-xs font-medium 
                           text-blue-600 hover:text-blue-700 border border-blue-200 
                           rounded-full hover:bg-blue-50 transition-all duration-200 
                           group whitespace-nowrap"
                  >
                    <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    </svg>
                    Navigate
                  </a>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  :global(.location-card-enter) {
    opacity: 0;
    transform: translateY(20px);
  }
  :global(.location-card-enter-active) {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 500ms, transform 500ms;
  }
</style> 