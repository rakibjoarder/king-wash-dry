import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';

// Create Supabase admin client
const supabaseAdmin = createClient(
  PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// This endpoint will bypass RLS because it runs server-side
export async function POST({ request }) {
  try {
    const customerData = await request.json();
    
    // Validate required fields
    const requiredFields = ['user_id', 'email'];
    for (const field of requiredFields) {
      if (!customerData[field]) {
        return json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Check if customer already exists
    const { data: existingCustomer, error: searchError } = await supabaseAdmin
      .from('customers')
      .select('id, user_id')
      .or(`email.eq.${customerData.email},user_id.eq.${customerData.user_id}`)
      .single();

    if (searchError && searchError.code !== 'PGRST116') {
      console.error('Error checking existing customer:', searchError);
      return json({ error: 'Error checking existing customer' }, { status: 500 });
    }

    if (existingCustomer) {
      // Update existing customer
      const { data: updatedCustomer, error: updateError } = await supabaseAdmin
        .from('customers')
        .update({
          user_id: customerData.user_id,
          first_name: customerData.first_name || existingCustomer.first_name,
          last_name: customerData.last_name || existingCustomer.last_name,
          email: customerData.email,
          phone: customerData.phone || existingCustomer.phone,
        })
        .eq('id', existingCustomer.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating customer:', updateError);
        return json({ error: 'Error updating customer record' }, { status: 500 });
      }

      return json({ 
        success: true, 
        customer: updatedCustomer, 
        action: 'updated' 
      });
    }

    // Create new customer
    const { data: newCustomer, error: insertError } = await supabaseAdmin
      .from('customers')
      .insert({
        user_id: customerData.user_id,
        first_name: customerData.first_name || '',
        last_name: customerData.last_name || '',
        email: customerData.email,
        phone: customerData.phone || '',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating customer:', insertError);
      return json({ error: insertError.message }, { status: 500 });
    }

    return json({ 
      success: true, 
      customer: newCustomer, 
      action: 'created' 
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
} 