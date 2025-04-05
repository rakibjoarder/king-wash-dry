<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchLocations, fetchServices, addOrder } from '$lib/api';
  import { locations, services, currentUser } from '$lib/stores';
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabase';
  import ServiceSelection from './ServiceSelection.svelte';
  import LaundryPreferences from './LaundryPreferences.svelte';
  import ItemSelector from './ItemSelector.svelte';
  import OrderReview from './OrderReview.svelte';
  import LocationCard from './LocationCard.svelte';
  import LoginModal from './LoginModal.svelte';
  
  // Update steps order
  const steps = ['Select Service', 'Schedule Pickup & Delivery', 'Preferences', 'Delivery Details', 'Review & Submit'];
  let currentStep = 0;
  let currentStepValid = false;
  
  // Items in the order
  let selectedItems: Array<any> = [];
  let itemTypes: Array<any> = [];
  let lastFetchedServiceId: string | null = null;
  
  interface LaundryPreferences {
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
  }

  let preferences: LaundryPreferences = {
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
  
  type ServiceType = 'pickup_and_dropoff' | 'pickup_only' | 'dropoff_only' | 'self_service';

  interface FormData {
    service_type: ServiceType;
    service_id: string;
    pickup_address: string;
    pickup_city: string;
    pickup_zip: string;
    dropoff_address: string;
    dropoff_city: string;
    dropoff_zip: string;
    pickup_date: string;
    pickup_time: string;
    drop_off_date: string;
    drop_off_time: string;
    weight: number;
    delivery_instructions?: string;
  }

  let formData: FormData = {
    service_type: '' as ServiceType,
    service_id: '',
    pickup_address: '',
    pickup_city: '',
    pickup_zip: '',
    dropoff_address: '',
    dropoff_city: '',
    dropoff_zip: '',
    pickup_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    pickup_time: '9AM - 11AM',
    drop_off_date: new Date().toISOString().split('T')[0],
    drop_off_time: '9AM - 11AM',
    weight: 0
  };
  
  let loading = false;
  let success = false;
  let error = '';
  let manualWeightEntry = false;
  
  let totalPrice = 0;
  
  // Add a ref for the items section
  let itemsSection: HTMLElement;
  
  // Add refs for each step section
  let stepSections: { [key: number]: HTMLElement } = {};
  
  // Add this near your other state variables
  let sameAddress = true; // Default to true since most users will have same address
  
  // Add showLoginModal state
  let showLoginModal = false;
  
  // Add function to save state
  function saveFormState() {
    const state = {
      currentStep,
      formData,
      preferences,
      selectedItems,
      sameAddress
    };
    localStorage.setItem('orderFormState', JSON.stringify(state));
  }

  // Add function to restore state
  function restoreFormState() {
    const savedState = localStorage.getItem('orderFormState');
    if (savedState) {
      const state = JSON.parse(savedState);
      currentStep = state.currentStep;
      formData = state.formData;
      preferences = state.preferences;
      selectedItems = state.selectedItems;
      sameAddress = state.sameAddress;
      localStorage.removeItem('orderFormState'); // Clear the saved state
    }
  }
  
  // Modify onMount to check for saved state
  onMount(async () => {
    try {
      await Promise.all([
        fetchLocations(),
        fetchServices()
      ]);

      // Check for auth state and saved form state
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        restoreFormState();
      }
      
      currentStepValid = validateStep(currentStep);
    } catch (error) {
      console.error('Error initializing order form:', error);
    }
  });
  
  // Add handleLoginSuccess function
  async function handleLoginSuccess() {
    showLoginModal = false;
    // Get the latest session
    const { data: { session } } = await supabase.auth.getSession();
    if (session && currentStep === 2) {
      currentStep = 3;
      currentStepValid = validateStep(currentStep);
      
      // Scroll to the next step
      setTimeout(() => {
        if (stepSections[currentStep]) {
          const yOffset = -80;
          const element = stepSections[currentStep];
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          
          window.scrollTo({
            top: y,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }
  
  // Calculate total price function
  function calculateEstimatedPrice() {
    const selectedService = $services.find(s => s.id.toString() === formData.service_id);
    if (!selectedService) return 0;
    
    let basePrice = selectedService.price * formData.weight;
    
    let additionalCosts = 0;
    if (preferences.additionalServices.babyCare) additionalCosts += 3.99;
    if (preferences.additionalServices.bleach) additionalCosts += 1.99;
    if (preferences.additionalServices.darkProtect) additionalCosts += 1.99;
    if (preferences.additionalServices.fabricSoftener) additionalCosts += 1.99;
    if (preferences.additionalServices.scentBooster) additionalCosts += 2.99;
    if (preferences.additionalServices.hangingService) additionalCosts += 4.99;
    
    return basePrice + additionalCosts;
  }
  
  // Move the reactive statement after the function definition
  $: totalPrice = calculateEstimatedPrice();
  
  // This reactive statement will update currentStepValid whenever formData changes
  $: currentStepValid = validateStep(currentStep);
  
  // Also specifically watch service_id changes
  $: if (formData.service_id) {
    currentStepValid = validateStep(currentStep);
  }
  
  // Fetch items from database based on selected service
  async function fetchItems(serviceId: string | null = null) {
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
  
  // Update the validation function for the new step order
  function validateStep(step: number): boolean {
    switch(step) {
      case 0: // Service Selection
        return !!formData.service_id;
      case 1: // Schedule
        if (formData.service_id === '3') { // Express Service
          return !!formData.pickup_time;
        }
        return !!formData.pickup_date && 
               !!formData.pickup_time && 
               !!formData.drop_off_date && 
               !!formData.drop_off_time;
      case 2: // Preferences
        return true;
      case 3: // Delivery Details
        return !!formData.dropoff_address && 
               !!formData.dropoff_city && 
               !!formData.dropoff_zip;
      case 4: // Review
        return true;
      default:
        return false;
    }
  }
  
  // Modify handleNextClick to save state before showing login modal
  async function handleNextClick() {
    if (currentStepValid) {
      // Check for authentication after preferences step (step 2)
      if (currentStep === 2) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          saveFormState(); // Save state before showing login modal
          showLoginModal = true;
          return;
        }
      }

      if (currentStep === 2) {
        currentStep = 3;
      } else {
        currentStep += 1;
      }
      
      currentStepValid = validateStep(currentStep);
      
      // Scroll to the next step after a small delay with offset
      setTimeout(() => {
        if (stepSections[currentStep]) {
          const yOffset = -80;
          const element = stepSections[currentStep];
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          
          window.scrollTo({
            top: y,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }
  
  function goToPrevStep() {
    if (currentStep > 0) {
      currentStep--;
      currentStepValid = validateStep(currentStep);
      
      // Scroll to the previous step after a small delay with offset
      setTimeout(() => {
        if (stepSections[currentStep]) {
          const yOffset = -80;
          const element = stepSections[currentStep];
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          
          window.scrollTo({
            top: y,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }
  
  // Modify handleSubmit to save state before showing login modal
  async function handleSubmit() {
    if (!$currentUser) {
      saveFormState(); // Save state before showing login modal
      showLoginModal = true;
      return;
    }
    
    loading = true;
    error = '';
    
    try {
      const orderData = {
        ...formData,
        preferences: JSON.stringify(preferences),
        items: JSON.stringify(selectedItems.filter(item => item.quantity > 0)),
        total_price: calculateEstimatedPrice()
      };

      console.log(orderData);
      
      // Create customer data object for the order
      const customerData = {
        user_id: $currentUser.id,
        email: $currentUser.email,
        pickup_address: formData.pickup_address,
        pickup_city: formData.pickup_city,
        pickup_zip: formData.pickup_zip,
        dropoff_address: formData.dropoff_address,
        dropoff_city: formData.dropoff_city,
        dropoff_zip: formData.dropoff_zip
      };
      
      const order = await addOrder(customerData, orderData);
      
      if (order) {
        success = true;
        goto(`/account?order=${order.id}`);
      }
    } catch (err: unknown) {
      console.error('Error submitting order:', err);
      if (err instanceof Error) {
        error = err.message;
      } else {
        error = 'There was an error submitting your order. Please try again.';
      }
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
  
  interface OrderData {
    service_type: ServiceType;
    service_id: string;
    pickup_address: string;
    pickup_city: string;
    pickup_zip: string;
    dropoff_address: string;
    dropoff_city: string;
    dropoff_zip: string;
    pickup_date: string;
    pickup_time: string;
    drop_off_date: string;
    drop_off_time: string;
    weight: number;
    preferences: string;
    items: string;
    total_price: number;
    delivery_instructions?: string;
  }

  // Submit order with payment
  async function submitOrderWithPayment(orderData: OrderData) {
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
    } catch (error: unknown) {
      console.error('Order submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create order';
      return {
        success: false,
        error: errorMessage
      };
    }
  }
  
  // Modify the service selection handler
  function handleServiceSelection(serviceId: string) {
    formData.service_id = serviceId;
    
    // Wait for items to be loaded and scroll to them with offset
    setTimeout(() => {
      if (itemsSection) {
        const yOffset = -80; // Add offset from top (adjust this value as needed)
        const y = itemsSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      }
    }, 100);
  }
</script>

<div class="w-full">
  <!-- Service Type Selection -->
  <div class="mb-8">
    <h2 class="text-xl font-semibold mb-4">Select Service Type</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <button
        class="p-6 border rounded-lg text-left hover:border-blue-500 transition-all
          {formData.service_type === 'pickup_and_dropoff' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}"
        on:click={() => formData.service_type = 'pickup_and_dropoff'}
      >
        <div class="flex items-start">
          <svg class="w-6 h-6 text-blue-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
          </svg>
          <div class="ml-3">
            <h3 class="font-medium">Full Service</h3>
            <p class="text-sm text-gray-500">We'll pick up your laundry and deliver it back to you</p>
          </div>
        </div>
      </button>

      <button
        class="p-6 border rounded-lg text-left hover:border-blue-500 transition-all
          {formData.service_type === 'self_service' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}"
        on:click={() => formData.service_type = 'self_service'}
      >
        <div class="flex items-start">
          <svg class="w-6 h-6 text-blue-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"/>
          </svg>
          <div class="ml-3">
            <h3 class="font-medium">Self Service</h3>
            <p class="text-sm text-gray-500">Use our facilities to do your own laundry</p>
            <p class="text-xs text-blue-600 mt-1">Washers starting from $2.50 | Dryers starting from $2.00</p>
          </div>
        </div>
      </button>
    </div>
  </div>

  {#if formData.service_type === 'self_service'}
    <!-- Store Locations -->
    <div class="mt-8 space-y-4">
      <h3 class="text-lg font-medium text-gray-900">Our Locations</h3>
      <p class="text-sm text-gray-500">Select a location to get directions</p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each $locations as location (location.id)}
          <LocationCard {location} showNavigateButton={true} />
        {/each}
      </div>
    </div>
  {:else if formData.service_type === 'pickup_and_dropoff'}
    <!-- Stepper Header -->
    <div class="mb-8">
      <!-- Desktop Stepper -->
      <div class="hidden md:flex items-center">
        {#each steps as step, index}
          <div class="flex items-center">
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                {index <= currentStep 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-500'}"
            >
              {index + 1}
            </div>
            
            <span class="ml-2 text-sm font-medium 
              {index === currentStep 
                ? 'text-blue-600' 
                : index < currentStep 
                  ? 'text-gray-900' 
                  : 'text-gray-500'}">
              {step}
            </span>
          </div>
          
          {#if index < steps.length - 1}
            <div class="flex-1 mx-4 h-0.5 {index < currentStep ? 'bg-blue-600' : 'bg-gray-200'}"></div>
          {/if}
        {/each}
      </div>
      
      <!-- Mobile Stepper -->
      <div class="md:hidden">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-gray-500">Step {currentStep + 1} of {steps.length}</span>
          <span class="text-sm font-medium text-blue-600">{steps[currentStep]}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div class="bg-blue-600 h-2.5 rounded-full" style="width: {(currentStep / (steps.length - 1)) * 100}%"></div>
        </div>
      </div>
    </div>
    
    <div class="mt-6">
      {#if currentStep === 0}
        <!-- Step 1: Service Selection -->
        <div class="space-y-6" bind:this={stepSections[0]}>
          <ServiceSelection 
            bind:selectedServiceId={formData.service_id} 
            onSelect={handleServiceSelection}
          />
          
          {#if formData.service_id}
            <div bind:this={itemsSection}>
              <ItemSelector 
                {itemTypes} 
                bind:selectedItems 
                bind:weight={formData.weight} 
                bind:manualWeightEntry 
              />
            </div>
          {/if}
        </div>
      {:else if currentStep === 1}
        <!-- Step 2: Schedule -->
        <div class="space-y-6" bind:this={stepSections[1]}>
          {#if formData.service_id === '3'} <!-- Express Wash & Fold -->
            <div class="space-y-4">
              {#if new Date().getHours() < 15} <!-- Check if it's before 3 PM -->
                <div>
                  <label class="flex items-center gap-2 text-lg font-medium text-gray-900 mb-4">
                    <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Express Pickup Today
                  </label>
                  
                  <!-- Time Selection -->
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {#each [
                      '9AM - 11AM',
                      '11AM - 1PM',
                      '1PM - 3PM'
                    ] as timeSlot}
                      <button
                        type="button"
                        class="px-4 py-3 text-sm border rounded-xl transition-all duration-200
                          {formData.pickup_time === timeSlot 
                            ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' 
                            : 'border-gray-200 text-gray-600 hover:border-blue-200 hover:bg-blue-50'}"
                        on:click={() => {
                          formData.pickup_time = timeSlot;
                          formData.pickup_date = new Date().toISOString().split('T')[0];
                        }}
                      >
                        {timeSlot}
                      </button>
                    {/each}
                  </div>

                  <!-- Express Service Message -->
                  {#if formData.pickup_time}
                    <div class="mt-6 p-6 bg-blue-50 rounded-xl border border-blue-200 space-y-4">
                      <div class="flex items-start gap-3">
                        <svg class="w-6 h-6 text-blue-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <div>
                          <h4 class="font-medium text-blue-900">Express Service Confirmed</h4>
                          <p class="text-sm text-blue-700 mt-1">
                            Our team will collect your laundry today between {formData.pickup_time}
                          </p>
                        </div>
                      </div>

                      <div class="flex items-start gap-3">
                        <svg class="w-6 h-6 text-blue-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                          <h4 class="font-medium text-blue-900">Same Day Delivery</h4>
                          <p class="text-sm text-blue-700 mt-1">
                            We'll process your order with priority and deliver it back to you as soon as it's ready. Our team will contact you for delivery coordination.
                          </p>
                        </div>
                      </div>
                    </div>
                  {/if}
                </div>
              {:else}
                <!-- After 3 PM Message -->
                <div class="p-6 bg-amber-50 rounded-xl border border-amber-200">
                  <div class="flex items-start gap-3">
                    <svg class="w-6 h-6 text-amber-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 class="font-medium text-amber-900">Express Service Unavailable</h4>
                      <p class="text-sm text-amber-700 mt-1">
                        Express service is only available for orders placed before 3:00 PM. Please select regular service or schedule for tomorrow.
                      </p>
                      <button
                        type="button"
                        class="mt-4 px-4 py-2 text-sm font-medium text-amber-700 bg-amber-100 rounded-lg hover:bg-amber-200 transition-colors"
                        on:click={() => {
                          formData.service_id = '1'; // Switch to regular service
                        }}
                      >
                        Switch to Regular Service
                      </button>
                    </div>
                  </div>
                </div>
              {/if}
            </div>
          {:else}
            <!-- Regular service scheduling code -->
            <div class="space-y-8">
              <!-- Pickup Section -->
              <div class="space-y-6">
                <h4 class="text-lg font-medium text-gray-900">Pickup Details</h4>
                <div>
                  <label class="flex items-center gap-2 text-base font-medium text-gray-800 mb-4">
                    <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Pickup Date
                  </label>
                  
                  <!-- Pickup Date Selection -->
                  <div class="relative">
                    <div class="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
                      {#each Array.from({length: 6}, (_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() + i + 1);
                        return date;
                      }) as date}
                        <button
                          type="button"
                          class="flex-shrink-0 p-3 sm:p-4 border rounded-lg transition-all duration-200
                            w-[140px] sm:w-[120px]
                            {formData.pickup_date === date.toISOString().split('T')[0] 
                              ? 'border-blue-500 bg-blue-50 text-blue-700' 
                              : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'}"
                          on:click={() => formData.pickup_date = date.toISOString().split('T')[0]}
                        >
                          <p class="text-sm font-medium mb-1">
                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                          </p>
                          <div class="flex items-baseline gap-1">
                            <span class="text-base sm:text-lg font-bold">
                              {date.toLocaleDateString('en-US', { month: 'short' })} {date.getDate()}
                            </span>
                            <span class="text-xs sm:text-sm text-gray-500">
                              {date.getFullYear()}
                            </span>
                          </div>
                        </button>
                      {/each}
                    </div>
                    <div class="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
                    <div class="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
                  </div>
                </div>

                <!-- Pickup Time -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-3">
                    Preferred Pickup Time
                  </label>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {#each [
                      '9AM - 11AM',
                      '11AM - 1PM',
                      '1PM - 3PM',
                      '3PM - 5PM',
                      '5PM - 7PM',
                      '7PM - 9PM'
                    ] as timeSlot}
                      <button
                        type="button"
                        class="px-4 py-3 text-sm border rounded-xl transition-all duration-200
                          {formData.pickup_time === timeSlot 
                            ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' 
                            : 'border-gray-200 text-gray-600 hover:border-blue-200 hover:bg-blue-50'}"
                        on:click={() => formData.pickup_time = timeSlot}
                      >
                        {timeSlot}
                      </button>
                    {/each}
                  </div>
                </div>
              </div>

              <!-- Delivery Section -->
              <div class="space-y-6 pt-8 border-t border-gray-200">
                <h4 class="text-lg font-medium text-gray-900">Delivery Details</h4>
                <div>
                  <label class="flex items-center gap-2 text-base font-medium text-gray-800 mb-4">
                    <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Delivery Date
                  </label>
                  
                  <!-- Delivery Date Selection -->
                  <div class="relative">
                    <div class="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
                      {#each Array.from({length: 6}, (_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() + i + 2); // Start from day after pickup
                        return date;
                      }) as date}
                        <button
                          type="button"
                          class="flex-shrink-0 p-3 sm:p-4 border rounded-lg transition-all duration-200
                            w-[140px] sm:w-[120px]
                            {formData.drop_off_date === date.toISOString().split('T')[0] 
                              ? 'border-blue-500 bg-blue-50 text-blue-700' 
                              : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'}"
                          on:click={() => formData.drop_off_date = date.toISOString().split('T')[0]}
                        >
                          <p class="text-sm font-medium mb-1">
                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                          </p>
                          <div class="flex items-baseline gap-1">
                            <span class="text-base sm:text-lg font-bold">
                              {date.toLocaleDateString('en-US', { month: 'short' })} {date.getDate()}
                            </span>
                            <span class="text-xs sm:text-sm text-gray-500">
                              {date.getFullYear()}
                            </span>
                          </div>
                        </button>
                      {/each}
                    </div>
                    <div class="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
                    <div class="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
                  </div>
                </div>

                <!-- Delivery Time -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-3">
                    Preferred Delivery Time
                  </label>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {#each [
                      '9AM - 11AM',
                      '11AM - 1PM',
                      '1PM - 3PM',
                      '3PM - 5PM',
                      '5PM - 7PM',
                      '7PM - 9PM'
                    ] as timeSlot}
                      <button
                        type="button"
                        class="px-4 py-3 text-sm border rounded-xl transition-all duration-200
                          {formData.drop_off_time === timeSlot 
                            ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' 
                            : 'border-gray-200 text-gray-600 hover:border-blue-200 hover:bg-blue-50'}"
                        on:click={() => formData.drop_off_time = timeSlot}
                      >
                        {timeSlot}
                      </button>
                    {/each}
                  </div>
                </div>
              </div>
            </div>
          {/if}
        </div>
      {:else if currentStep === 2}
        <div bind:this={stepSections[2]}>
          <LaundryPreferences bind:preferences bind:weight={formData.weight} />
        </div>
      {:else if currentStep === 3}
        <div class="space-y-6" bind:this={stepSections[3]}>
          <h3 class="text-lg font-medium text-gray-900">Pickup & Delivery Details</h3>
          
          <!-- Pickup Address Section -->
          <div class="space-y-6">
            <h4 class="text-base font-medium text-gray-800">Pickup Address</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  bind:value={formData.pickup_address}
                  placeholder="Enter pickup address"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                  on:input={() => {
                    if (sameAddress) {
                      formData.dropoff_address = formData.pickup_address;
                      formData.dropoff_city = formData.pickup_city;
                      formData.dropoff_zip = formData.pickup_zip;
                    }
                  }}
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  bind:value={formData.pickup_city}
                  placeholder="City"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                  on:input={() => {
                    if (sameAddress) {
                      formData.dropoff_city = formData.pickup_city;
                    }
                  }}
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code
                </label>
                <input
                  type="text"
                  bind:value={formData.pickup_zip}
                  placeholder="ZIP"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                  on:input={() => {
                    if (sameAddress) {
                      formData.dropoff_zip = formData.pickup_zip;
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <!-- Toggle Switch for Same Address -->
          <div class="flex items-center justify-between py-4 px-4 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <h4 class="text-base font-medium text-gray-800">Same Delivery Address</h4>
              <p class="text-sm text-gray-500">Use pickup address for delivery</p>
            </div>
            <button 
              type="button" 
              class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                {sameAddress ? 'bg-blue-600' : 'bg-gray-200'}"
              on:click={() => {
                sameAddress = !sameAddress;
                if (sameAddress) {
                  formData.dropoff_address = formData.pickup_address;
                  formData.dropoff_city = formData.pickup_city;
                  formData.dropoff_zip = formData.pickup_zip;
                }
              }}
            >
              <span 
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                  {sameAddress ? 'translate-x-5' : 'translate-x-0'}"
              />
            </button>
          </div>

          <!-- Delivery Address Section - Only show if addresses are different -->
          {#if !sameAddress}
            <div class="space-y-6 mt-8 pt-8 border-t border-gray-200">
              <h4 class="text-base font-medium text-gray-800">Delivery Address</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    bind:value={formData.dropoff_address}
                    placeholder="Enter delivery address"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    bind:value={formData.dropoff_city}
                    placeholder="City"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    bind:value={formData.dropoff_zip}
                    placeholder="ZIP"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          {/if}

          <!-- Special Instructions - Always visible -->
          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Delivery Instructions (Optional)
            </label>
            <textarea
              bind:value={formData.delivery_instructions}
              placeholder="Any special instructions for delivery? (e.g., 'Leave at front desk', 'Call upon arrival')"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 min-h-[100px]"
            ></textarea>
          </div>
        </div>
      {:else if currentStep === 4}
        <div bind:this={stepSections[4]}>
          <OrderReview 
            {formData}
            {preferences}
            {selectedItems}
            calculateEstimatedPrice={() => calculateEstimatedPrice()}
            onSubmitOrder={handleSubmit}
          />
        </div>
      {/if}
    </div>
    
    <!-- Navigation Buttons -->
    <div class="flex justify-between mt-8">
      <button 
        type="button"
        class="px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors
          {currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''}"
        disabled={currentStep === 0}
        on:click={goToPrevStep}
      >
        Previous
      </button>
      
      <button 
        type="button"
        class="px-4 py-2 text-sm md:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors
          {!currentStepValid ? 'opacity-50 cursor-not-allowed' : ''}"
        disabled={!currentStepValid}
        on:click={currentStep === 4 ? handleSubmit : handleNextClick}
      >
        {#if currentStep === 4}
          Submit Order
        {:else if currentStep === 3}
          Review Order
        {:else}
          Next
        {/if}
      </button>
    </div>
  {/if}
</div>

<!-- Add LoginModal at the bottom of the template -->
{#if showLoginModal}
  <LoginModal 
    on:close={() => showLoginModal = false}
    on:success={handleLoginSuccess}
  />
{/if}

<style>
  /* Hide scrollbar but keep functionality */
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
  }
</style> 