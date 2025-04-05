<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { currentUser } from '$lib/stores';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  
  async function createCustomerRecord(user: any) {
    try {
      // Check if the user signed in with Google
      const isGoogleLogin = user.app_metadata?.provider === 'google';
      
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: user.id,
          email: user.email,
          // Handle name differently for Google login
          first_name: isGoogleLogin 
            ? user.user_metadata?.full_name?.split(' ')[0] || ''
            : user.user_metadata?.first_name || '',
          last_name: isGoogleLogin
            ? user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || ''
            : user.user_metadata?.last_name || '',
          phone: user.phone || ''
        })
      });

      if (!response.ok) {
        const result = await response.json();
        console.error('Error creating customer:', result);
      } else {
        console.log('Customer record created/updated successfully for', isGoogleLogin ? 'Google' : 'Email', 'login');
      }
    } catch (error) {
      console.error('Error handling customer record:', error);
    }
  }
  
  onMount(() => {
    let subscription: { unsubscribe: () => void };
    
    const init = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
      }
      
      if (session?.user) {
        console.log('Initial session found:', session.user);
        currentUser.set(session.user);
        await createCustomerRecord(session.user);
      }
      
      const { data: { subscription: sub } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          currentUser.set(session?.user || null);
          if (session?.user && session.user.app_metadata?.provider === 'google') {
            createCustomerRecord(session.user);
          }
        } else if (event === 'SIGNED_OUT') {
          currentUser.set(null);
        }
      });
      
      subscription = sub;
    };

    init();
    
    return () => {
      subscription?.unsubscribe();
    };
  });
</script>

<div class="flex flex-col min-h-screen">
  <Navbar />
  <main class="flex-grow">
    <slot />
  </main>
  <Footer />
</div> 