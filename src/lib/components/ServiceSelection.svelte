<script lang="ts">
  import { services } from '$lib/stores';
  
  // Export the selected service ID
  export let selectedServiceId: string = '';
  export let onSelect: (serviceId: string) => void = () => {};
  
  // Handle service selection
  function selectService(id: string) {
    selectedServiceId = id;
  }
</script>

<div class="mb-6">
  <h2 class="text-xl font-bold text-center mb-4">Choose Your Service</h2>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    {#each $services as service}
      <div 
        class="border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md {selectedServiceId === service.id.toString() ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}"
        on:click={() => {
          selectedServiceId = service.id.toString();
          onSelect(service.id.toString());
        }}
      >
        <div class="flex items-center">
          <div class="text-primary-500 mr-4 flex-shrink-0">
            {#if service.name.toLowerCase().includes('wash')}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 15a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h14a2 2 0 012 2v7z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v7m-4-3.5h8" />
              </svg>
            {:else if service.name.toLowerCase().includes('dry')}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            {/if}
          </div>
          <div>
            <h3 class="text-lg font-bold">{service.name}</h3>
            <p class="text-sm text-gray-600 mb-1">{service.description}</p>
            <p class="text-primary-600 font-semibold">${service.price.toFixed(2)}/lb</p>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
