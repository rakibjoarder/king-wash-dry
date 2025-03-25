<script lang="ts">
  export let steps: string[] = [];
  export let currentStep: number = 0;
  
  function goToStep(step: number) {
    if (step >= 0 && step < steps.length) {
      currentStep = step;
    }
  }
</script>

<div class="mb-8">
  <!-- Stepper Header - Simplified for mobile -->
  <div class="hidden md:flex items-center justify-between mb-8">
    {#each steps as step, index}
      <div class="flex items-center">
        <!-- Step Circle -->
        <div 
          class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
            {index < currentStep 
              ? 'bg-primary-600 text-white' 
              : index === currentStep 
                ? 'bg-primary-100 text-primary-600 border-2 border-primary-600' 
                : 'bg-gray-100 text-gray-500'}"
        >
          {index + 1}
        </div>
        
        <!-- Step Label -->
        <span 
          class="ml-2 text-sm font-medium 
            {index === currentStep 
              ? 'text-primary-600' 
              : index < currentStep 
                ? 'text-gray-900' 
                : 'text-gray-500'}"
        >
          {step}
        </span>
      </div>
      
      <!-- Connector Line -->
      {#if index < steps.length - 1}
        <div class="flex-1 mx-4 h-0.5 {index < currentStep ? 'bg-primary-600' : 'bg-gray-200'}"></div>
      {/if}
    {/each}
  </div>
  
  <!-- Mobile Stepper - Simplified version for small screens -->
  <div class="md:hidden mb-6">
    <div class="flex justify-between items-center mb-2">
      <span class="text-sm font-medium text-gray-500">Step {currentStep + 1} of {steps.length}</span>
      <span class="text-sm font-medium text-primary-600">{steps[currentStep]}</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-2.5">
      <div class="bg-primary-600 h-2.5 rounded-full" style="width: {(currentStep / (steps.length - 1)) * 100}%"></div>
    </div>
  </div>
  
  <!-- Navigation Buttons -->
  <div class="flex justify-between mt-8">
    <button 
      type="button"
      class="btn btn-outline px-4 py-2 text-sm md:text-base"
      disabled={currentStep === 0}
      on:click={() => goToStep(currentStep - 1)}
    >
      Previous
    </button>
    
    <button 
      type="button"
      class="btn btn-primary px-4 py-2 text-sm md:text-base"
      disabled={currentStep === steps.length - 1}
      on:click={() => goToStep(currentStep + 1)}
    >
      {currentStep === steps.length - 2 ? 'Review Order' : 'Next'}
    </button>
  </div>
</div> 