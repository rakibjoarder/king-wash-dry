<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchLocations, fetchServices, addOrder } from '$lib/api';
  import { locations, services, currentUser } from '$lib/stores';
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabase';
  import ServiceSelection from './ServiceSelection.svelte';
  import LaundryPreferences from './LaundryPreferences.svelte';
  import ItemSelector from './ItemSelector.svelte';
  import AddressForm from './AddressForm.svelte';
  import OrderReview from './OrderReview.svelte';
  
  // Define steps for the stepper
  const steps = ['Select Service', 'Choose Items', 'Laundry Preferences', 'Delivery Details', 'Review & Submit'];
  let currentStep = 0;
  let currentStepValid = false;
  
  // Items in the order
  let selectedItems = [];
  let itemTypes = [];
  
  // Store the last fetched service ID to prevent duplicate calls
  let lastFetchedServiceId = null;
  
  // Add laundry preferences object
  let preferences = {
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
  
  let formData = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    location_id: '',
    service_id: '',
    weight: 0,
    notes: '',
    pickup_requested: true,
    pickup_date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    drop_off_date: new Date().toISOString().split('T')[0] // Today
  };
  
  let loading = false;
  let success = false;
  let error = '';
  let manualWeightEntry = false;
  
  // This reactive statement will update currentStepValid whenever formData changes
  $: currentStepValid = validateStep(currentStep);
  
  // Also specifically watch service_id changes
  $: if (formData.service_id) {
    currentStepValid = validateStep(currentStep);
  }
  
  // Fetch data on mount
  onMount(async () => {
    try {
      await Promise.all([
        fetchLocations(),
        fetchServices(),
        fetchItems()
      ]);
      
      // Set default location if available
      if ($locations.length > 0) {
        formData.location_id = $locations[0].id.toString();
      }
      
      // Initial validation
      currentStepValid = validateStep(currentStep);
      
      // Check if user is logged in and pre-fill form data
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        currentUser.set(data.session.user);
        
        // Fetch customer data if available
        const { data: customerData } = await supabase
          .from('customers')
          .select('*')
          .eq('user_id', data.session.user.id)
          .single();
          
        if (customerData) {
          formData.first_name = customerData.first_name;
          formData.last_name = customerData.last_name;
          formData.email = customerData.email;
          formData.phone = customerData.phone;
          formData.address = customerData.address || '';
          formData.city = customerData.city || '';
          formData.state = customerData.state || '';
          formData.zip = customerData.zip || '';
        }
      }
    } catch (error) {
      console.error('Error initializing order form:', error);
    }
  });
  
  // Fetch items from database based on selected service
  async function fetchItems(serviceId = null) {
    try {
      let query = supabase.from('items').select('*');
      
      // If a service is selected, filter items by service_id
      if (serviceId) {
        query = query.eq('service_id', serviceId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      if (data && data.length > 0) {
        itemTypes = data;
        selectedItems = data.map(item => ({
          ...item,
          quantity: 0
        }));
      } else {
        // Fallback to default items if none in database
        itemTypes = [
          { id: 'shirt', name: 'Shirts', avg_weight: 0.3, icon: 'shirt' },
          { id: 'pants', name: 'Pants/Jeans', avg_weight: 0.6, icon: 'pants' },
          { id: 'dress', name: 'Dresses', avg_weight: 0.5, icon: 'dress' },
          { id: 'sweater', name: 'Sweaters', avg_weight: 0.7, icon: 'sweater' },
          { id: 'jacket', name: 'Jackets', avg_weight: 1.0, icon: 'jacket' },
          { id: 'bedding', name: 'Bedding', avg_weight: 2.0, icon: 'bedding' },
          { id: 'towel', name: 'Towels', avg_weight: 0.5, icon: 'towel' },
          { id: 'other', name: 'Other Items', avg_weight: 0.5, icon: 'other' }
        ];
        
        selectedItems = itemTypes.map(item => ({
          ...item,
          quantity: 0
        }));
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  }
  
  // Watch for service_id changes to update items
  $: if (formData.service_id && formData.service_id !== lastFetchedServiceId) {
    lastFetchedServiceId = formData.service_id;
    fetchItems(formData.service_id);
  }
  
  // Calculate total price
  function calculateEstimatedPrice() {
    const selectedService = $services.find(s => s.id.toString() === formData.service_id);
    if (!selectedService) return 0;
    
    let basePrice = selectedService.price * formData.weight;
    
    // Add costs for additional services
    let additionalCosts = 0;
    if (preferences.additionalServices.babyCare) additionalCosts += 3.99;
    if (preferences.additionalServices.bleach) additionalCosts += 1.99;
    if (preferences.additionalServices.darkProtect) additionalCosts += 1.99;
    if (preferences.additionalServices.fabricSoftener) additionalCosts += 1.99;
    if (preferences.additionalServices.scentBooster) additionalCosts += 2.99;
    if (preferences.additionalServices.hangingService) additionalCosts += 4.99;
    
    return basePrice + additionalCosts;
  }
  
  // Calculate total price
  let totalPrice = 0;
  $: totalPrice = calculateEstimatedPrice();
  
  // Validate current step
  function validateStep(step) {
    switch(step) {
      case 0: // Service Selection
        return !!formData.service_id;
      case 1: // Item Selection
        return formData.weight > 0;
      case 2: // Laundry Preferences
        return true; // Always valid
      case 3: // Delivery Details
        return !!formData.first_name && 
               !!formData.last_name && 
               !!formData.email && 
               !!formData.phone && 
               !!formData.location_id &&
               (!formData.pickup_requested || !!formData.pickup_date);
      case 4: // Review
        return true; // Always valid
      default:
        return false;
    }
  }
  
  // Navigation functions
  function goToNextStep() {
    if (currentStep < steps.length - 1 && currentStepValid) {
      currentStep++;
      currentStepValid = validateStep(currentStep);
    }
  }
  
  function goToPrevStep() {
    if (currentStep > 0) {
      currentStep--;
      currentStepValid = validateStep(currentStep);
    }
  }
  
  function handleNextClick() {
    if (currentStepValid) {
      currentStep += 1;
      currentStepValid = validateStep(currentStep);
    }
  }
  
  // Handle form submission
  async function handleSubmit() {
    if (!$currentUser) {
      goto('/login?redirect=/order');
      return;
    }
    
    loading = true;
    error = '';
    
    try {
      // Calculate final price
      totalPrice = calculateEstimatedPrice();
      console.log({
        ...formData,
        preferences: JSON.stringify(preferences),
        items: JSON.stringify(selectedItems.filter(item => item.quantity > 0)),
        total_price: totalPrice
      });
      
      // Create order
      const order = await addOrder({
        ...formData,
        preferences: JSON.stringify(preferences),
        items: JSON.stringify(selectedItems.filter(item => item.quantity > 0)),
        total_price: totalPrice
      });
    
      
      if (order) {
        success = true;
        goto(`/account?order=${order.id}`);
      }
    } catch (err) {
      console.error('Error submitting order:', err);
      error = 'There was an error submitting your order. Please try again.';
    } finally {
      loading = false;
    }
  }
  
  // Update weight based on selected items
  $: {
    if (!manualWeightEntry) {
      const newWeight = selectedItems.reduce((total, item) => {
        return total + (item.quantity * (item.avg_weight || 0.5));
      }, 0);
      formData.weight = newWeight;
    }
  }
  
  // Submit order with payment
  async function submitOrderWithPayment(orderData) {
    try {
      // Create order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create order');
      }
      
      return {
        success: true,
        orderId: result.id
      };
    } catch (error) {
      console.error('Order submission error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create order'
      };
    }
  }
</script>

<div class="w-full">
  <!-- Stepper Header -->
  <div class="mb-8">
    <!-- Desktop Stepper -->
    <div class="hidden md:flex items-center">
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
    
    <!-- Mobile Stepper -->
    <div class="md:hidden">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm font-medium text-gray-500">Step {currentStep + 1} of {steps.length}</span>
        <span class="text-sm font-medium text-primary-600">{steps[currentStep]}</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2.5">
        <div class="bg-primary-600 h-2.5 rounded-full" style="width: {(currentStep / (steps.length - 1)) * 100}%"></div>
      </div>
    </div>
  </div>
  
  <div class="mt-6">
    <!-- Step 1: Select Service -->
    {#if currentStep === 0}
      <ServiceSelection bind:selectedServiceId={formData.service_id} />
      
      {#if !currentStepValid}
        <p class="text-red-500 text-sm mt-4">Please select a service to continue</p>
      {/if}
    
    <!-- Step 2: Choose Items -->
    {:else if currentStep === 1}
      <ItemSelector itemTypes={itemTypes} bind:selectedItems bind:weight={formData.weight} bind:manualWeightEntry />
      
      {#if !currentStepValid}
        <p class="text-red-500 text-sm mt-4">Please add at least one item or enter a weight to continue</p>
      {/if}
    
    <!-- Step 3: Laundry Preferences -->
    {:else if currentStep === 2}
      <LaundryPreferences bind:preferences bind:weight={formData.weight} />
    
    <!-- Step 4: Delivery Details -->
    {:else if currentStep === 3}
      <AddressForm bind:formData />
      
      {#if !currentStepValid}
        <p class="text-red-500 text-sm mt-4">Please complete all required address fields to continue</p>
      {/if}
    
    <!-- Step 5: Review & Submit -->
    {:else if currentStep === 4}
      <OrderReview 
        {formData} 
        {preferences} 
        {selectedItems} 
        {calculateEstimatedPrice} 
        onSubmitOrder={submitOrderWithPayment}
      />
    {/if}
  </div>
  
  <!-- Navigation Buttons -->
  <div class="flex justify-between mt-8">
    <button 
      type="button"
      class="btn btn-outline px-4 py-2 text-sm md:text-base"
      disabled={currentStep === 0}
      on:click={goToPrevStep}
    >
      Previous
    </button>
    
    {#if currentStep < 4}
      <button 
        type="button"
        class="btn btn-primary px-4 py-2 text-sm md:text-base"
        disabled={!currentStepValid}
        on:click={handleNextClick}
      >
        {currentStep === 3 ? 'Review Order' : 'Next'}
      </button>
    {/if}
  </div>
</div> 