<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { currentUser } from '$lib/stores';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  
  onMount(async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      currentUser.set(data.session.user);
    }
    
    supabase.auth.onAuthStateChange((_, session) => {
      currentUser.set(session?.user || null);
    });
  });
</script>

<div class="flex flex-col min-h-screen">
  <Navbar />
  <main class="flex-grow">
    <slot />
  </main>
  <Footer />
</div> 