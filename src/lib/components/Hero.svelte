

<div class="relative overflow-hidden min-h-[600px] max-h-[700px] w-full bg-gradient-to-br from-gray-900 to-black">
  <!-- Video Background -->
  <div class="absolute inset-0 w-full h-full">
    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 z-10"></div>
    <iframe
      src="https://player.vimeo.com/video/1076965974?background=1&autoplay=1&muted=1&loop=1&byline=0&title=0"
      style="position: absolute; top: 50%; left: 50%; width: 177.77777778vh; min-width: 100%; height: 56.25vw; min-height: 100%; transform: translate(-50%, -50%); pointer-events: none;"
      frameborder="0"
      allow="autoplay; fullscreen"
      allowfullscreen
      title="Background Video"
    ></iframe>
  </div>

  <!-- Content -->
  <div class="relative z-20 h-full">
    <div class="h-full flex items-center">
      <div class="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div class="max-w-xl space-y-6">
          <!-- Main Content -->
          <div class="space-y-4">
            <h1 class="text-3xl sm:text-5xl font-bold text-white leading-tight tracking-tight text-left">
              Discover the Next<br>Evolution of<br>
              <span class="text-[#3b82f6] inline-block">Laundry</span>
            </h1>
            <p class="text-base sm:text-lg text-gray-300 leading-relaxed text-left">
              Professional laundry services delivered to your door. Save time and enjoy fresh, clean clothes without the hassle.
            </p>
            <div class="flex flex-wrap gap-4 justify-start">
              <a href="/order" 
                on:click={() => {
                 localStorage.removeItem('orderFormState');  
                }}
                class="group relative inline-flex items-center px-8 py-4 text-base font-medium overflow-hidden rounded-full bg-[#3b82f6] text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_8px_rgba(59,130,246,0.3)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <span class="relative z-10">Schedule Pickup</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="relative z-10 h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          <!-- Reviews Section -->
          <div class="relative">
            <div class="flex items-center space-x-4 justify-start">
              <div class="flex -space-x-3">
                {#each Array(4) as _, i}
                  <div class="relative">
                    <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse" style="animation-delay: {i * 200}ms"></div>
                    <img 
                      class="relative h-12 w-12 rounded-full ring-2 ring-white/20 shadow-lg transition-transform hover:scale-110" 
                      src="https://randomuser.me/api/portraits/{i % 2 ? 'women' : 'men'}/{i + 1}.jpg" 
                      alt=""
                    >
                  </div>
                {/each}
              </div>
              <div class="flex items-center space-x-2">
                <div class="flex">
                  {#each Array(5) as _, i}
                    <svg 
                      class="w-5 h-5 text-yellow-400 filter drop-shadow transition-transform hover:scale-110" 
                      style="animation: float 2s ease-in-out infinite {i * 200}ms"
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  {/each}
                </div>
                <span class="text-gray-300 font-medium">900+ Reviews</span>
              </div>
            </div>
          </div>

          <!-- Features -->
          <div class="flex flex-wrap gap-2 justify-start">
            {#each [
              { icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', text: 'Eco Friendly' },
              { icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', text: 'Money Saving' },
              { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', text: 'Time Saving' }
            ] as feature}
              <div class="group flex items-center gap-2 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-white/10 hover:scale-105 transition-all duration-300 border border-white/10">
                <svg class="w-5 h-5 text-[#3b82f6] transition-colors group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={feature.icon}/>
                </svg>
                <span class="text-gray-300 font-medium group-hover:text-white transition-colors">{feature.text}</span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .opacity-0 {
    opacity: 0;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }

  iframe {
    object-fit: cover;
  }

  :global(.dark) {
    .from-gray-900 {
      @apply from-black;
    }
  }
</style>

<script>
  import { onMount } from 'svelte';
  let displayText = "";
  const fullText = "Laundry";
  let cursorVisible = true;
  let isTyping = true;

  onMount(() => {
    // Start typing effect
    typeText();
    // Blink cursor
    setInterval(() => {
      cursorVisible = !cursorVisible;
    }, 500);
  });

  async function typeText() {
    for (let i = 0; i <= fullText.length; i++) {
      displayText = fullText.substring(0, i);
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    setTimeout(() => {
      isTyping = false;
    }, 500);
  }
</script> 