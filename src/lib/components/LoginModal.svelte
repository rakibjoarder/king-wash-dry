<script lang="ts">
  import { supabase } from '$lib/supabaseClient';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  
  let email = '';
  let password = '';
  let loading = false;
  let error: string | null = null;

  async function handleEmailLogin() {
    try {
      loading = true;
      error = null;
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;

      if (data.session) {
        dispatch('success');
        closeModal();
      }
    } catch (err) {
      if (err instanceof Error) {
        error = err.message;
      }
    } finally {
      loading = false;
    }
  }

  async function handleGoogleLogin() {
    try {
      loading = true;
      error = null;
      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (signInError) throw signInError;
    } catch (err) {
      if (err instanceof Error) {
        error = err.message;
      }
    } finally {
      loading = false;
    }
  }

  function closeModal() {
    dispatch('close');
  }
</script>

<!-- Modal Backdrop -->
<div class="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
  <!-- Modal Content -->
  <div 
    class="bg-white rounded-lg max-w-md w-full p-6 relative animate-fadeIn"
    on:click|stopPropagation
  >
    <!-- Close Button -->
    <button 
      class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      on:click={closeModal}
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <div class="text-center">
      <img class="mx-auto h-16 w-auto" src="/images/logo.png" alt="King Wash & Dry Logo" />
      <h2 class="mt-4 text-2xl font-bold text-gray-900">Sign in to your account</h2>
    </div>
    
    {#if error}
      <div class="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
        {error}
      </div>
    {/if}

    <form class="mt-6 space-y-4" on:submit|preventDefault={handleEmailLogin}>
      <div>
        <label for="email-address" class="sr-only">Email address</label>
        <input
          bind:value={email}
          id="email-address"
          name="email"
          type="email"
          required
          class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          placeholder="Email address"
        />
      </div>
      <div>
        <label for="password" class="sr-only">Password</label>
        <input
          bind:value={password}
          id="password"
          name="password"
          type="password"
          required
          class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          placeholder="Password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        class="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {#if loading}
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        {/if}
        Sign in with Email
      </button>
    </form>

    <div class="mt-4">
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <button
        on:click={handleGoogleLogin}
        disabled={loading}
        class="mt-4 w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" class="w-5 h-5 mr-2" />
        Sign in with Google
      </button>
    </div>

    <p class="mt-4 text-center text-sm text-gray-600">
      Don't have an account?
      <button 
        on:click={() => dispatch('switchToRegister')}
        class="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition duration-150 ease-in-out"
      >
        Create one
      </button>
    </p>
  </div>
</div>

<style>
  .animate-fadeIn {
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
</style> 