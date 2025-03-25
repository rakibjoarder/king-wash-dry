<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabase';
  import { currentUser } from '$lib/stores';
  
  let formData = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  };
  
  let customerId = null;
  let loading = true;
  let saving = false;
  let success = false;
  let error = '';
  
  onMount(async () => {
    // Check if user is logged in
    const { data } = await supabase.auth.getSession();
    
    if (!data.session) {
      goto('/login?redirect=/account/edit');
      return;
    }
    
    currentUser.set(data.session.user);
    
    try {
      // Fetch customer data
      const { data: customerResult, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', data.session.user.id)
        .single();
      
      if (customerError) throw customerError;
      
      customerId = customerResult.id;
      
      // Populate form data
      formData = {
        first_name: customerResult.first_name || '',
        last_name: customerResult.last_name || '',
        email: customerResult.email || '',
        phone: customerResult.phone || '',
        address: customerResult.address || '',
        city: customerResult.city || '',
        state: customerResult.state || '',
        zip: customerResult.zip || ''
      };
    } catch (err) {
      console.error('Error fetching customer data:', err);
      error = 'Failed to load your account data. Please try again.';
    } finally {
      loading = false;
    }
  });
  
  async function handleSubmit() {
    saving = true;
    error = '';
    success = false;
    
    try {
      // Update customer data
      const { error: updateError } = await supabase
        .from('customers')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip
        })
        .eq('id', customerId);
      
      if (updateError) throw updateError;
      
      success = true;
    } catch (err) {
      console.error('Error updating profile:', err);
      error = 'Failed to update your profile. Please try again.';
    } finally {
      saving = false;
    }
  }
</script>

<div class="bg-primary-700 text-white py-12">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-extrabold">Edit Profile</h1>
    <p class="mt-4 text-xl">Update your account information</p>
  </div>
</div>

<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  {#if loading}
    <div class="flex justify-center">
      <svg class="animate-spin h-10 w-10 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  {:else}
    <div class="bg-white shadow rounded-lg p-6">
      <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        {#if error}
          <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        {/if}
        
        {#if success}
          <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            Your profile has been updated successfully.
          </div>
        {/if}
        
        <div>
          <h2 class="text-xl font-bold mb-4">Personal Information</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="first_name" class="block text-sm font-medium text-gray-700">First Name</label>
              <input
                id="first_name"
                type="text"
                required
                bind:value={formData.first_name}
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label for="last_name" class="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                id="last_name"
                type="text"
                required
                bind:value={formData.last_name}
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div class="mt-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              disabled
              value={formData.email}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 sm:text-sm"
            />
            <p class="mt-1 text-xs text-gray-500">Email cannot be changed. Contact support if you need to update your email.</p>
          </div>
          
          <div class="mt-4">
            <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              id="phone"
              type="tel"
              required
              bind:value={formData.phone}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
        </div>
        
        <div>
          <h2 class="text-xl font-bold mb-4">Address Information</h2>
          
          <div>
            <label for="address" class="block text-sm font-medium text-gray-700">Street Address</label>
            <input
              id="address"
              type="text"
              bind:value={formData.address}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
          
          <div class="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label for="city" class="block text-sm font-medium text-gray-700">City</label>
              <input
                id="city"
                type="text"
                bind:value={formData.city}
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label for="state" class="block text-sm font-medium text-gray-700">State</label>
              <input
                id="state"
                type="text"
                bind:value={formData.state}
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div class="mt-4">
            <label for="zip" class="block text-sm font-medium text-gray-700">ZIP Code</label>
            <input
              id="zip"
              type="text"
              bind:value={formData.zip}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
        </div>
        
        <div class="flex justify-end space-x-3">
          <a 
            href="/account" 
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </a>
          <button
            type="submit"
            disabled={saving}
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {#if saving}
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            {:else}
              Save Changes
            {/if}
          </button>
        </div>
      </form>
    </div>
  {/if}
</div> 