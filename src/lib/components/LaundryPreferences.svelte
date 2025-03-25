<script lang="ts">
  import { calculateAdditionalCosts } from '$lib/utils/pricing';

  // Define types for preferences
  type LaundryPreferences = {
    waterTemperature: 'hot' | 'cold';
    dryingLevel: 'regular' | 'low';
    detergent: 'scented' | 'hypoallergenic';
    additionalServices: {
      babyCare: boolean;
      bleach: boolean;
      darkProtect: boolean;
      fabricSoftener: boolean;
      scentBooster: boolean;
      hangingService: boolean;
    };
    specialInstructions: string;
  };

  // This component handles laundry preferences selection
  export let preferences: LaundryPreferences = {
    waterTemperature: 'cold',
    dryingLevel: 'regular',
    detergent: 'scented',
    additionalServices: {
      babyCare: false,
      bleach: false,
      darkProtect: false,
      fabricSoftener: false,
      scentBooster: false,
      hangingService: false
    },
    specialInstructions: ''
  };
  
  export let weight: number = 0;
  export let additionalCosts: number = 0;
  
  // Calculate additional costs using the shared utility function
  $: additionalCosts = calculateAdditionalCosts(preferences, weight);
</script>

<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
  <h2 class="text-lg font-medium mb-4">Laundry Preferences</h2>
  <p class="text-gray-600 mb-6">Customize your perfect laundry experience</p>
  
  <!-- Water Temperature -->
  <div class="mb-6">
    <div class="flex items-center text-primary-600 mb-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
      <span class="font-medium">Water Temperature</span>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div 
        class="border rounded-lg p-4 cursor-pointer {preferences.waterTemperature === 'hot' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}"
        on:click={() => preferences.waterTemperature = 'hot'}
      >
        <div class="flex items-center">
          <div class="flex-shrink-0 text-primary-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div class="ml-3">
            <h4 class="text-sm font-medium text-gray-900">Hot Wash</h4>
            <p class="text-xs text-gray-500">Best for: White clothes, bedding, towels</p>
          </div>
        </div>
      </div>
      
      <div 
        class="border rounded-lg p-4 cursor-pointer {preferences.waterTemperature === 'cold' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}"
        on:click={() => preferences.waterTemperature = 'cold'}
      >
        <div class="flex items-center">
          <div class="flex-shrink-0 text-primary-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </div>
          <div class="ml-3">
            <h4 class="text-sm font-medium text-gray-900">Cold Wash</h4>
            <p class="text-xs text-gray-500">Best for: Dark colors, delicates, and everyday clothes</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Drying Level -->
  <div class="mb-6">
    <div class="flex items-center text-primary-600 mb-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <span class="font-medium">Drying Level</span>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div 
        class="border rounded-lg p-4 cursor-pointer {preferences.dryingLevel === 'regular' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}"
        on:click={() => preferences.dryingLevel = 'regular'}
      >
        <div class="flex items-center">
          <div class="flex-shrink-0 text-primary-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div class="ml-3">
            <h4 class="text-sm font-medium text-gray-900">Regular Heat</h4>
            <p class="text-xs text-gray-500">Standard drying for most items</p>
          </div>
        </div>
      </div>
      
      <div 
        class="border rounded-lg p-4 cursor-pointer {preferences.dryingLevel === 'low' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}"
        on:click={() => preferences.dryingLevel = 'low'}
      >
        <div class="flex items-center">
          <div class="flex-shrink-0 text-primary-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </div>
          <div class="ml-3">
            <h4 class="text-sm font-medium text-gray-900">Low Heat</h4>
            <p class="text-xs text-gray-500">Gentle drying for delicates and shrink-prone items</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Detergent -->
  <div class="mb-6">
    <div class="flex items-center text-primary-600 mb-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      <span class="font-medium">Detergent</span>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div 
        class="border rounded-lg p-4 cursor-pointer {preferences.detergent === 'scented' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}"
        on:click={() => preferences.detergent = 'scented'}
      >
        <div class="flex items-center">
          <div class="flex-shrink-0 text-primary-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div class="ml-3">
            <h4 class="text-sm font-medium text-gray-900">Scented</h4>
            <p class="text-xs text-gray-500">Fresh scent for all your laundry</p>
          </div>
        </div>
      </div>
      
      <div 
        class="border rounded-lg p-4 cursor-pointer {preferences.detergent === 'hypoallergenic' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}"
        on:click={() => preferences.detergent = 'hypoallergenic'}
      >
        <div class="flex items-center">
          <div class="flex-shrink-0 text-primary-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div class="ml-3">
            <h4 class="text-sm font-medium text-gray-900">Hypoallergenic</h4>
            <p class="text-xs text-gray-500">(+$0.25/pound)</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Additional Services -->
  <div class="mb-6">
    <div class="flex items-center text-primary-600 mb-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      <span class="font-medium">Additional Services</span>
    </div>
    
    <div class="space-y-3">
      <!-- Baby Care -->
      <div class="flex items-center justify-between border rounded-lg p-3">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <div>
            <div class="font-medium text-sm">Baby Care 🍼</div>
            <div class="text-xs text-gray-500">Baby clothes washed separately with baby detergent (+$0.2/pound)</div>
          </div>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" bind:checked={preferences.additionalServices.babyCare} class="sr-only peer">
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      </div>
      
      <!-- Bleach -->
      <div class="flex items-center justify-between border rounded-lg p-3">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <div>
            <div class="font-medium text-sm">Bleach</div>
            <div class="text-xs text-gray-500">Use bleach as instructed (+$0.2/pound)</div>
          </div>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" bind:checked={preferences.additionalServices.bleach} class="sr-only peer">
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      </div>
      
      <!-- Dark Protect -->
      <div class="flex items-center justify-between border rounded-lg p-3">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <div>
            <div class="font-medium text-sm">Dark Protect</div>
            <div class="text-xs text-gray-500">OxiClean Dark Protect Liquid (+$0.2/pound)</div>
          </div>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" bind:checked={preferences.additionalServices.darkProtect} class="sr-only peer">
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      </div>
      
      <!-- Fabric Softener -->
      <div class="flex items-center justify-between border rounded-lg p-3">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <div>
            <div class="font-medium text-sm">Fabric Softener</div>
            <div class="text-xs text-gray-500">Downy (+$0.2/pound)</div>
          </div>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" bind:checked={preferences.additionalServices.fabricSoftener} class="sr-only peer">
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      </div>
      
      <!-- Scent Booster -->
      <div class="flex items-center justify-between border rounded-lg p-3">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          <div>
            <div class="font-medium text-sm">Scent Booster</div>
            <div class="text-xs text-gray-500">Downy (+$0.2/pound)</div>
          </div>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" bind:checked={preferences.additionalServices.scentBooster} class="sr-only peer">
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      </div>
      
      <!-- Hanging Service -->
      <div class="flex items-center justify-between border rounded-lg p-3">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <div>
            <div class="font-medium text-sm">Hanging Service</div>
            <div class="text-xs text-gray-500">We will hang your items with hangers (+$0.35 each)</div>
          </div>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" bind:checked={preferences.additionalServices.hangingService} class="sr-only peer">
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      </div>
    </div>
  </div>
  
  <!-- Special Instructions -->
  <div>
    <div class="flex items-center text-primary-600 mb-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
      <span class="font-medium">Special Instructions</span>
    </div>
    
    <textarea 
      bind:value={preferences.specialInstructions}
      class="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-primary-500 focus:border-primary-500"
      rows="4"
      placeholder="Add any special instructions here..."
    ></textarea>
  </div>
  
  {#if additionalCosts > 0}
    <div class="mt-4 p-3 bg-primary-50 rounded-lg border border-primary-100">
      <div class="flex justify-between items-center">
        <span class="text-sm font-medium text-gray-700">Additional Services Cost:</span>
        <span class="text-lg font-bold text-primary-700">+${additionalCosts.toFixed(2)}</span>
      </div>
    </div>
  {/if}
</div> 