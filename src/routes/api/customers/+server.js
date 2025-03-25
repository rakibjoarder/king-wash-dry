import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

// This endpoint will bypass RLS because it runs server-side
export async function POST({ request }) {
  try {
    const customerData = await request.json();
    
    // Validate the data
    if (!customerData.email || !customerData.first_name || !customerData.last_name) {
      return json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Check if customer exists
    const { data: existingCustomers, error: searchError } = await supabase
      .from('customers')
      .select('*')
      .eq('email', customerData.email)
      .limit(1);
      
    if (searchError) {
      return json({ error: searchError.message }, { status: 500 });
    }
    
    let customerId;
    
    if (existingCustomers && existingCustomers.length > 0) {
      // Update existing customer
      const { error: updateError } = await supabase
        .from('customers')
        .update({
          first_name: customerData.first_name,
          last_name: customerData.last_name,
          phone: customerData.phone,
          address: customerData.address,
          city: customerData.city,
          state: customerData.state,
          zip: customerData.zip,
          user_id: customerData.user_id || existingCustomers[0].user_id
        })
        .eq('id', existingCustomers[0].id);
        
      if (updateError) {
        return json({ error: updateError.message }, { status: 500 });
      }
      
      customerId = existingCustomers[0].id;
    } else {
      // Create new customer
      const { data: newCustomer, error: insertError } = await supabase
        .from('customers')
        .insert({
          first_name: customerData.first_name,
          last_name: customerData.last_name,
          email: customerData.email,
          phone: customerData.phone,
          address: customerData.address,
          city: customerData.city,
          state: customerData.state,
          zip: customerData.zip,
          user_id: customerData.user_id
        })
        .select()
        .single();
        
      if (insertError) {
        return json({ error: insertError.message }, { status: 500 });
      }
      
      customerId = newCustomer.id;
    }
    
    return json({ id: customerId });
  } catch (error) {
    console.error('Error in customer API:', error);
    return json({ error: 'Server error' }, { status: 500 });
  }
} 