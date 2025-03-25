<script lang="ts">
  import StepperOrderForm from '$lib/components/StepperOrderForm.svelte';
</script>

<div class="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
  <h1 class="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Place Your Order</h1>
  
  <div class="bg-white rounded-lg shadow-lg overflow-hidden">
    <div class="p-4 sm:p-6 md:p-8">
      <StepperOrderForm />
    </div>
  </div>
  
  <div class="mt-10 sm:mt-12">
    <h2 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">How It Works</h2>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
      <div class="bg-white p-4 sm:p-6 rounded-lg shadow">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-3 sm:mb-4">
          <span class="text-lg sm:text-xl font-bold">1</span>
        </div>
        <h3 class="text-base sm:text-lg font-medium mb-2">Select Your Items</h3>
        <p class="text-sm sm:text-base text-gray-600">Choose the types and quantities of items you need cleaned.</p>
      </div>
      
      <div class="bg-white p-4 sm:p-6 rounded-lg shadow">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-3 sm:mb-4">
          <span class="text-lg sm:text-xl font-bold">2</span>
        </div>
        <h3 class="text-base sm:text-lg font-medium mb-2">Schedule a Pickup</h3>
        <p class="text-sm sm:text-base text-gray-600">Fill out the form with your details and preferred pickup time.</p>
      </div>
      
      <div class="bg-white p-4 sm:p-6 rounded-lg shadow">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-3 sm:mb-4">
          <span class="text-lg sm:text-xl font-bold">3</span>
        </div>
        <h3 class="text-base sm:text-lg font-medium mb-2">We Pick Up Your Laundry</h3>
        <p class="text-sm sm:text-base text-gray-600">Our team will arrive at your location to collect your laundry.</p>
      </div>
      
      <div class="bg-white p-4 sm:p-6 rounded-lg shadow">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-3 sm:mb-4">
          <span class="text-lg sm:text-xl font-bold">4</span>
        </div>
        <h3 class="text-base sm:text-lg font-medium mb-2">Clean Laundry Delivered</h3>
        <p class="text-sm sm:text-base text-gray-600">We'll clean your items and deliver them back to you, fresh and folded.</p>
      </div>
    </div>
  </div>
  
  <div class="mt-10 sm:mt-12 bg-gray-50 p-4 sm:p-6 rounded-lg">
    <h2 class="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Frequently Asked Questions</h2>
    
    <div class="space-y-3 sm:space-y-4">
      <div>
        <h3 class="text-base sm:text-lg font-medium">How is my order priced?</h3>
        <p class="text-sm sm:text-base text-gray-600 mt-1">Our pricing is based on weight and the service you select. As you add items to your order, we'll estimate the total weight and calculate the price automatically.</p>
      </div>
      
      <div>
        <h3 class="text-base sm:text-lg font-medium">How much does pickup and delivery cost?</h3>
        <p class="text-sm sm:text-base text-gray-600 mt-1">Pickup and delivery is complimentary for orders over $25. For smaller orders, a $5 fee applies.</p>
      </div>
      
      <div>
        <h3 class="text-base sm:text-lg font-medium">What areas do you service?</h3>
        <p class="text-sm sm:text-base text-gray-600 mt-1">We currently offer pickup and delivery in Richardson, Garland, and Mesquite areas.</p>
      </div>
      
      <div>
        <h3 class="text-base sm:text-lg font-medium">How do I pay for my order?</h3>
        <p class="text-sm sm:text-base text-gray-600 mt-1">Payment is collected upon delivery. We accept cash, credit cards, and mobile payment options.</p>
      </div>
      
      <div>
        <h3 class="text-base sm:text-lg font-medium">What if I'm not home during pickup or delivery?</h3>
        <p class="text-sm sm:text-base text-gray-600 mt-1">You can leave special instructions in the notes section, or we can reschedule for a more convenient time.</p>
      </div>
    </div>
  </div>
</div> 