<script lang="ts">
  import StepperOrderForm from '$lib/components/StepperOrderForm.svelte';
</script>

<div class="container mx-auto px-4 py-12 sm:py-16 max-w-5xl mb-44">
  <h1 class="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-center">Place Your Order</h1>
  
  <div class="bg-white rounded-xl shadow-lg overflow-hidden">
    <div class="p-6 sm:p-8 md:p-10">
      <StepperOrderForm />
    </div>
  </div>
</div> 