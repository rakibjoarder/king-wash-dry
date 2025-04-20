<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { currentUser } from '$lib/stores';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  
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
        
        // Check if we need to return to order page
        const shouldReturn = localStorage.getItem('returnAfterLogin');
        if (shouldReturn === 'true') {
          console.log('Return after login flag found in session initialization');
          localStorage.removeItem('returnAfterLogin');
          
          // Get saved form state from our special backup
          const savedOrderState = localStorage.getItem('lastOrderStep');
          if (savedOrderState) {
            console.log('Found saved order state, will restore form');
            
            try {
              // Parse the state to check it
              const stateObj = JSON.parse(savedOrderState);
              console.log('Form was at step:', stateObj.currentStep);
              
              // Ensure the step is set to preferences (2) or delivery (3)
              if (stateObj.currentStep < 2) {
                console.log('Setting step to 2 (Preferences)');
                stateObj.currentStep = 2;
                localStorage.setItem('orderFormState', JSON.stringify(stateObj));
              } else {
                // Just use it as is
                localStorage.setItem('orderFormState', savedOrderState);
              }
            } catch (e) {
              console.error('Error processing saved state:', e);
              // Fallback to direct copy
              localStorage.setItem('orderFormState', savedOrderState);
            }
            
            localStorage.removeItem('lastOrderStep');
            
            // Set continueOrder flag for StepperOrderForm component
            console.log('Setting continue order flag');
            localStorage.setItem('continueOrder', 'true');
            
            // Go to the order page
            console.log('Redirecting to order page');
            goto('/order');
          } else {
            console.log('No saved order state found');
          }
        }
        
        await createCustomerRecord(session.user);
      }
      
      const { data: { subscription: sub } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          currentUser.set(session?.user || null);
          
          // Check if we need to return to order page after sign-in
          if (event === 'SIGNED_IN') {
            const shouldReturn = localStorage.getItem('returnAfterLogin');
            if (shouldReturn === 'true') {
              console.log('Return after login flag found in auth state change');
              localStorage.removeItem('returnAfterLogin');
              
              // Get saved form state from our special backup
              const savedOrderState = localStorage.getItem('lastOrderStep');
              if (savedOrderState) {
                console.log('Found saved order state, will restore form');
                
                try {
                  // Parse the state to check it
                  const stateObj = JSON.parse(savedOrderState);
                  console.log('Form was at step:', stateObj.currentStep);
                  
                  // Ensure the step is set to preferences (2) or delivery (3)
                  if (stateObj.currentStep < 2) {
                    console.log('Setting step to 2 (Preferences)');
                    stateObj.currentStep = 2;
                    localStorage.setItem('orderFormState', JSON.stringify(stateObj));
                  } else {
                    // Just use it as is
                    localStorage.setItem('orderFormState', savedOrderState);
                  }
                } catch (e) {
                  console.error('Error processing saved state:', e);
                  // Fallback to direct copy
                  localStorage.setItem('orderFormState', savedOrderState);
                }
                
                localStorage.removeItem('lastOrderStep');
                
                // Set continueOrder flag for StepperOrderForm component
                console.log('Setting continue order flag');
                localStorage.setItem('continueOrder', 'true');
                
                // Go to the order page
                console.log('Redirecting to order page');
                goto('/order');
              } else {
                console.log('No saved order state found');
              }
            }
          }
          
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