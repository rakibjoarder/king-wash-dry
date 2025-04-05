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
      await new Promise(resolve => setTimeout(resolve, 150)); // Adjust typing speed here
    }
    // Hide cursor when typing is complete
    isTyping = false;
  }
</script>

<div class="bg-white min-h-[600px]">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
    <!-- Hero Content -->
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <h1 class="text-5xl font-bold text-gray-900 leading-tight">
          Discover the Next<br>Evolution of<br>
          <span class="text-[#0284C7] inline-block">
            {displayText}{#if isTyping}<span class:opacity-0={!cursorVisible} class="animate-blink">|</span>{/if}
          </span>
        </h1>
        <div class="max-w-[300px] sm:max-w-full">
          <p class="mt-6 text-lg text-gray-600 break-words">
            You can use our services in any convenient way – the choice is yours.
          </p>
        </div>
        <a href="/order" class="mt-8 inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-[#e11d48] hover:bg-[#be123c] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e11d48]">
          Schedule Pickup
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <!-- Reviews Section -->
        <div class="mt-12">
          <div class="flex items-center space-x-4">
            <!-- Review Avatars -->
            <div class="flex -space-x-2">
              <img class="h-8 w-8 rounded-full ring-2 ring-white" src="https://randomuser.me/api/portraits/men/1.jpg" alt="">
              <img class="h-8 w-8 rounded-full ring-2 ring-white" src="https://randomuser.me/api/portraits/women/2.jpg" alt="">
              <img class="h-8 w-8 rounded-full ring-2 ring-white" src="https://randomuser.me/api/portraits/men/3.jpg" alt="">
              <img class="h-8 w-8 rounded-full ring-2 ring-white" src="https://randomuser.me/api/portraits/women/4.jpg" alt="">
            </div>
            <!-- Stars -->
            <div class="flex items-center space-x-1">
              {#each Array(5) as _}
                <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              {/each}
              <span class="text-gray-600 ml-2">900+ Reviews</span>
            </div>
          </div>
        </div>

        <!-- Features -->
        <div class="mt-9 flex flex-wrap gap-1 sm:gap-2">
          {#each [
            { icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', text: 'Eco Friendly' },
            { icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', text: 'Money Saving' },
            { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', text: 'Time Saving' }
          ] as feature}
            <div class="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-all duration-300 border border-blue-100">
              <svg class="w-5 h-5 text-[#0284C7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={feature.icon}/>
              </svg>
              <span class="text-gray-700 font-medium text-sm">{feature.text}</span>
            </div>
          {/each}
        </div>
      </div>

      <!-- Hero Image -->
      <div class="relative">
        <div class="rounded-3xl overflow-hidden bg-[#22c55e]/10 h-[500px] hidden sm:block">
          <img 
            src="https://images.unsplash.com/photo-1545173168-9f1947eebb7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
            alt="Laundry Professional" 
            class="w-full h-full object-cover"
          >
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
</style> 