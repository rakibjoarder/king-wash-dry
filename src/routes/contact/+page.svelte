<script lang="ts">
  import { enhance } from '$app/forms';
  import { supabase } from '$lib/supabaseClient';
  
  let formSubmitted = false;
  let formError = false;
  let submitMessage = '';
  let isSubmitting = false;
  
  // Form data
  let name = '';
  let email = '';
  let phone = '';
  let subject = 'General Inquiry';
  let message = '';
  
  const subjectOptions = [
    'General Inquiry',
    'Customer Support',
    'Business Opportunities',
    'Careers',
    'Feedback',
    'Other'
  ];
  
  async function handleSubmit(event: Event) {
    event.preventDefault();
    
    // Basic validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      submitMessage = 'Please fill out all required fields';
      formError = true;
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      submitMessage = 'Please enter a valid email address';
      formError = true;
      return;
    }
    
    // Prevent multiple submissions
    if (isSubmitting) return;
    isSubmitting = true;
    formError = false;
    
    try {
      // Submit to Supabase
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert([
          { 
            name, 
            email, 
            phone: phone || null, 
            subject, 
            message,
            status: 'new'
          }
        ]);
      
      if (error) throw error;
      
      // Reset form
      name = '';
      email = '';
      phone = '';
      subject = 'General Inquiry';
      message = '';
      
      formSubmitted = true;
      formError = false;
      submitMessage = 'Your message has been sent! We\'ll get back to you shortly.';
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        formSubmitted = false;
        submitMessage = '';
      }, 5000);
      
    } catch (error) {
      console.error('Error submitting contact form:', error);
      formError = true;
      submitMessage = 'There was an error sending your message. Please try again.';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<svelte:head>
  <title>King Wash & Dry - Contact Us</title>
  <meta name="description" content="Get in touch with King Wash & Dry. We're here to help with all your laundry service needs." />
</svelte:head>

<div class="bg-gray-50 min-h-screen">
  <!-- Page header with background -->
  <div class="relative py-16 bg-gradient-to-r from-blue-700 to-blue-900 overflow-hidden">
    <!-- Background pattern -->
    <div class="absolute inset-0 opacity-20">
      <svg class="h-full w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none">
        <path d="M0 4a2 2 0 0 1 2-2h28a2 2 0 0 1 2 2v24a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4z" fill="currentColor" />
      </svg>
    </div>
    
    <!-- Diagonal lines -->
    <div class="absolute inset-y-0 right-0 w-1/2 opacity-30">
      <svg class="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0 L100 100 L100 0 Z" fill="currentColor" />
      </svg>
    </div>
    
    <!-- Floating elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-16 -left-16 w-32 h-32 rounded-full bg-white opacity-10 animate-float-slow"></div>
      <div class="absolute top-10 right-10 w-24 h-24 rounded-full bg-white opacity-10 animate-float-medium"></div>
      <div class="absolute bottom-10 left-1/4 w-20 h-20 rounded-full bg-white opacity-10 animate-float-fast"></div>
    </div>
    
    <!-- Content -->
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Get in Touch
        </h1>
        <p class="mt-4 max-w-2xl mx-auto text-lg text-blue-100">
          We're here to help with all your laundry service needs. Feel free to reach out!
        </p>
      </div>
    </div>
  </div>
  
  <!-- Add animation classes to the <style> section -->
  <style>
    @keyframes float-slow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }
    
    @keyframes float-medium {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-15px); }
    }
    
    @keyframes float-fast {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    
    :global(.animate-float-slow) {
      animation: float-slow 8s ease-in-out infinite;
    }
    
    :global(.animate-float-medium) {
      animation: float-medium 6s ease-in-out infinite;
    }
    
    :global(.animate-float-fast) {
      animation: float-fast 4s ease-in-out infinite;
    }
  </style>
  
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Contact Information Column -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-5">Contact Information</h2>
          
          <div class="space-y-5">
            <!-- Corporate Office -->
            <div>
              <h3 class="font-medium text-gray-800 flex items-center text-base">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Corporate Office
              </h3>
              <div class="ml-7 text-gray-600 text-sm mt-1">
                <p>King Wash & Dry Corporate Office</p>
                <p>100 N Central Expy, Suite 812</p>
                <p>Richardson, TX 75080</p>
                <p>United States</p>
              </div>
            </div>
            
            <!-- Phone -->
            <div>
              <h3 class="font-medium text-gray-800 flex items-center text-base">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Phone
              </h3>
              <p class="ml-7 text-gray-600 text-sm mt-1">
                <a href="tel:+19453355112" class="hover:text-blue-700 transition-colors duration-200">
                  +1 (945) 335-5112
                </a>
              </p>
            </div>
            
            <!-- Email -->
            <div>
              <h3 class="font-medium text-gray-800 flex items-center text-base">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </h3>
              <p class="ml-7 text-gray-600 text-sm mt-1">
                <a href="mailto:kingwashanddry07@gmail.com" class="hover:text-blue-700 transition-colors duration-200">
                  kingwashanddry07@gmail.com
                </a>
              </p>
            </div>
            
            <!-- Business Hours -->
            <div>
              <h3 class="font-medium text-gray-800 flex items-center text-base">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Business Hours
              </h3>
              <div class="ml-7 text-gray-600 text-sm mt-1">
                <p><strong>Corporate Office:</strong></p>
                <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                <p class="mt-1"><strong>Customer Service:</strong></p>
                <p>Monday - Friday: 8:00 AM - 8:00 PM</p>
                <p>Saturday: 9:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>
          
          <!-- Social Media Links -->
          <div class="mt-6">
            <h3 class="font-medium text-gray-800 mb-2 text-base">Connect With Us</h3>
            <div class="flex space-x-4 ml-2">
              <a href="#" class="text-gray-500 hover:text-blue-600 transition-colors duration-200">
                <span class="sr-only">Facebook</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
                </svg>
              </a>
              <a href="#" class="text-gray-500 hover:text-blue-600 transition-colors duration-200">
                <span class="sr-only">Instagram</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />
                </svg>
              </a>
              <a href="#" class="text-gray-500 hover:text-blue-600 transition-colors duration-200">
                <span class="sr-only">Twitter</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <!-- Map -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
          <iframe
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=100+N+Central+Expy+Suite+812,+Richardson,+TX+75080"
            class="w-full h-[250px] border-0"
            allowfullscreen={true}
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Map of Corporate Office"
          ></iframe>
        </div>
      </div>
      
      <!-- Contact Form Column -->
      <div class="md:col-span-1 lg:col-span-2">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-5">Send Us a Message</h2>
          
          {#if formSubmitted}
            <div class="p-3 mb-4 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
              <div class="flex">
                <svg class="h-5 w-5 text-green-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <p>{submitMessage}</p>
              </div>
            </div>
          {/if}
          
          {#if formError && !formSubmitted}
            <div class="p-3 mb-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              <div class="flex">
                <svg class="h-5 w-5 text-red-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                <p>{submitMessage}</p>
              </div>
            </div>
          {/if}
          
          <form on:submit={handleSubmit} class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Name -->
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input 
                  type="text" 
                  id="name" 
                  bind:value={name} 
                  required
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Your name"
                />
              </div>
              
              <!-- Email -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input 
                  type="email" 
                  id="email" 
                  bind:value={email} 
                  required
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Phone -->
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                <input 
                  type="tel" 
                  id="phone" 
                  bind:value={phone}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="(123) 456-7890"
                />
              </div>
              
              <!-- Subject -->
              <div>
                <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                <select 
                  id="subject" 
                  bind:value={subject}
                  required
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  {#each subjectOptions as option}
                    <option value={option}>{option}</option>
                  {/each}
                </select>
              </div>
            </div>
            
            <!-- Message -->
            <div>
              <label for="message" class="block text-sm font-medium text-gray-700 mb-1">Message *</label>
              <textarea 
                id="message" 
                bind:value={message}
                required
                rows="5" 
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="How can we help you?"
              ></textarea>
            </div>
            
            <!-- Submit Button -->
            <div class="flex justify-end">
              <button 
                type="submit" 
                class="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {#if isSubmitting}
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                {:else}
                  Send Message
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                {/if}
              </button>
            </div>
          </form>
        </div>
        
        <!-- FAQ teaser -->
        <!--<div class="bg-blue-50 rounded-lg p-6 mt-6 shadow-sm">
          <h3 class="text-lg font-bold text-gray-900 mb-2">Frequently Asked Questions</h3>
          <p class="text-gray-600 mb-4 text-sm">
            Find quick answers to common questions about our services, pricing, and policies.
          </p>
          <a 
            href="/faq" 
            class="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium text-sm"
          >
            Visit our FAQ page
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>-->
      </div>
    </div>
  </div>
</div> 