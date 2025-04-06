<script lang="ts">
  interface Item {
    id: string;
    name: string;
    avg_weight: number;
    quantity: number;
    icon?: string;
  }

  export let itemTypes: Item[] = [];
  export let selectedItems: Item[] = [];
  export let weight = 0;
  export let manualWeightEntry = false;
  export let service: string;
  
  // Initialize items when itemTypes changes
  $: if (itemTypes.length > 0) {
    selectedItems = itemTypes.map(type => ({
      ...type,
      quantity: selectedItems.find(item => item.id === type.id)?.quantity || 0
    }));
  }
  
  // Reset selections when service changes
  $: if (service) {
    selectedItems = itemTypes.map(type => ({
      ...type,
      quantity: 0
    }));
    weight = 0;
    manualWeightEntry = false;
  }
  
  // Calculate total weight from selected items
  $: calculatedWeight = selectedItems.reduce((total, item) => {
    return total + (item.quantity * (item.avg_weight || 0.5));
  }, 0).toFixed(2);
  
  // Update the weight whenever calculatedWeight changes
  $: if (!manualWeightEntry) {
    weight = parseFloat(calculatedWeight);
  }
  
  // Keep track of the calculated weight even when manual entry is on
  $: displayWeight = manualWeightEntry ? weight : parseFloat(calculatedWeight);
  
  function updateItemQuantity(itemId: string, change: number) {
    selectedItems = selectedItems.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(0, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
  }
  
  function getItemIcon(iconName: string): string {
    switch (iconName) {
      case 'shirt':
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 2L2 6v14a2 2 0 002 2h16a2 2 0 002-2V6l-4-4M3 6l5 .5M21 6l-5 .5M12 6v12M8 12h8" />
        </svg>`;
      case 'pants':
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v18m6-18v18M3 3h18M3 21h18" />
        </svg>`;
      case 'dress':
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v20M7 4h10l-2 6h-6l-2-6zM5 14h14" />
        </svg>`;
      case 'sweater':
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3-3h12l3 3M3 6v14a2 2 0 002 2h14a2 2 0 002-2V6M8 12h8" />
        </svg>`;
      case 'jacket':
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3-3h12l3 3M3 6v14a2 2 0 002 2h14a2 2 0 002-2V6M6 18h12M6 14h12M6 10h12" />
        </svg>`;
      case 'bedding':
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>`;
      case 'towel':
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h18v6H3V3zM3 12h18v2H3v-2zM3 17h18v4H3v-4z" />
        </svg>`;
      case 'underwear':
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3c-1.2 0-2.4.6-3 1.5-.6-.9-1.8-1.5-3-1.5-2 0-3.5 1.6-3.5 3.5 0 1.4.5 2.5 1.5 3.5l8 8 8-8c1-1 1.5-2.1 1.5-3.5C21.5 4.6 20 3 18 3c-1.2 0-2.4.6-3 1.5-.6-.9-1.8-1.5-3-1.5z" />
        </svg>`;
      case 'child':
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>`;
      case 'suit':
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>`;
      case 'silk':
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>`;
      case 'blouse':
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 2L2 6v14a2 2 0 002 2h16a2 2 0 002-2V6l-4-4M3 6l5 .5M21 6l-5 .5M12 6v12M8 12h8" />
        </svg>`;
      case 'linen':
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>`;
      default:
        return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>`;
    }
  }
  
  // Count total items
  $: totalItems = selectedItems.reduce((total, item) => total + item.quantity, 0);
</script>

<div class="space-y-6">
  <div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-medium">Select Your Items</h3>
      <div class="text-sm bg-primary-50 text-primary-700 px-3 py-1 rounded-full">
        Estimated Weight: {calculatedWeight} lbs
      </div>
    </div>
    
    <div class="grid grid-cols-1 gap-3">
      {#each selectedItems as item}
        <div class="border rounded-lg p-3 flex items-center justify-between {item.quantity > 0 ? 'border-primary-100 bg-primary-50/50' : ''}">
          <div class="flex items-center">
            <div class="w-7 h-7 flex items-center justify-center bg-primary-50 text-primary-600 rounded-full mr-2">
              {@html item.icon ? getItemIcon(item.icon) : '<span>' + item.name.charAt(0) + '</span>'}
            </div>
            <div>
              <p class="font-medium text-sm">{item.name}</p>
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <span>{item.avg_weight} lbs each</span>
                {#if item.quantity > 0}
                  <span class="text-primary-600">Total: {(item.quantity * item.avg_weight).toFixed(2)} lbs</span>
                {/if}
              </div>
            </div>
          </div>
          
          <div class="flex items-center">
            <button 
              class="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
              on:click={() => updateItemQuantity(item.id, -1)}
            >
              -
            </button>
            <span class="mx-3 w-6 text-center">{item.quantity}</span>
            <button 
              class="w-7 h-7 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 hover:bg-primary-100"
              on:click={() => updateItemQuantity(item.id, 1)}
            >
              +
            </button>
          </div>
        </div>
      {/each}
    </div>
    
    <div class="mt-4 bg-primary-50 border border-primary-100 p-4 rounded-lg shadow-sm">
      <h4 class="text-primary-800 font-medium text-lg mb-2">Order Summary</h4>
      <div class="grid grid-cols-2 gap-2">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
          <span class="text-gray-700">Total Items:</span>
        </div>
        <div class="text-primary-700 font-medium text-right">{totalItems}</div>
        
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
          <span class="text-gray-700">Estimated Weight:</span>
        </div>
        <div class="text-primary-700 font-medium text-right">{displayWeight} lbs</div>
      </div>
      <p class="text-xs text-primary-600 mt-3 italic">Note: Weights are based on average estimates. Actual weight may vary when your items are processed.</p>
    </div>
  </div>
  
  <div class="border-t pt-4">
    <div class="flex items-center justify-between mb-2">
      <div>
        <span class="font-medium">Weight Entry</span>
        <p class="text-xs text-gray-500">Choose how to determine your order's weight</p>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-600">Auto</span>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" bind:checked={manualWeightEntry} class="sr-only peer">
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
        <span class="text-sm text-gray-600">Manual</span>
      </div>
    </div>
    
    <div class="mt-3 p-4 bg-gray-50 rounded-lg">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div class="flex items-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span class="font-medium text-gray-700">Calculated Weight</span>
          </div>
          <div class="bg-white p-3 rounded border border-gray-200 text-center">
            <span class="text-xl font-bold text-primary-700">{calculatedWeight} lbs</span>
            <p class="text-xs text-gray-500 mt-1">Based on your selected items</p>
          </div>
        </div>
        
        {#if manualWeightEntry}
          <div>
            <div class="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span class="font-medium text-gray-700">Manual Weight</span>
            </div>
            <div class="bg-white p-3 rounded border border-primary-200">
              <input 
                type="number" 
                id="weight" 
                bind:value={weight} 
                min="0.01" 
                step="0.01" 
                on:input={(e) => {
                  const target = e.target as HTMLInputElement;
                  weight = Number(Number(target.value).toFixed(2));
                }}
                class="input w-full text-center text-xl font-bold text-primary-700" 
                placeholder="Enter weight in lbs"
              />
              <p class="text-xs text-gray-500 mt-1">Enter your estimated weight</p>
            </div>
          </div>
        {/if}
      </div>
      
      {#if manualWeightEntry}
        <div class="mt-3 flex justify-end">
          <button 
            class="px-3 py-1 bg-primary-100 text-primary-700 rounded hover:bg-primary-200 text-sm flex items-center"
            on:click={() => weight = parseFloat(calculatedWeight)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset to Calculated
          </button>
        </div>
      {/if}
    </div>
  </div>
</div> 