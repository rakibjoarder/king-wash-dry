import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import type { Handle } from '@sveltejs/kit';

// Create Supabase client with service role key for server-side operations
const supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export const handle: Handle = async ({ event, resolve }) => {
  // Get the authorization header
  const authHeader = event.request.headers.get('Authorization');
  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Remove 'Bearer ' prefix
    if (token) {
      // Verify the user with the admin client
      const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
      
      if (!userError && user) {
        // Add the user to the event locals
        event.locals.user = user;
      }
    }
  }

  // Add Supabase admin client to locals
  event.locals.supabase = supabaseAdmin;

  // Resolve the request
  return resolve(event);
}; 