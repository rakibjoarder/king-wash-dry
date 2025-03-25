import { json } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createClient } from '@supabase/supabase-js';

/**
 * POST handler for creating a new order
 */
export async function POST({ request }) {
  try {
    const orderData = await request.json();
    console.log('Order data received:', orderData);
    
    // Validate required fields
    const requiredFields = [
      'first_name', 'last_name', 'email', 'phone',
      'service_id', 'location_id', 'weight',
      'drop_off_date', 'drop_off_time'
    ];
    
    for (const field of requiredFields) {
      if (!orderData[field]) {
        return json({ 
          error: `Missing required field: ${field}` 
        }, { status: 400 });
      }
    }
    
    // Create Supabase admin client
    const supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // First, check if user is logged in
    const { data: session } = await supabaseAdmin.auth.getSession();
    let customerId;
    
    if (session?.user) {
      // User is logged in, get their customer ID
      const { data: customerData, error: customerError } = await supabaseAdmin
        .from('customers')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle();
      
      if (customerError) {
        console.error('Error fetching customer by user_id:', customerError);
      } else if (customerData) {
        customerId = customerData.id;
        console.log('Found customer ID from logged in user:', customerId);
      }
    }
    
    // If no customer ID found from session, try to find by email
    if (!customerId) {
      const { data: existingCustomer, error: customerFetchError } = await supabaseAdmin
        .from('customers')
        .select('id')
        .eq('email', orderData.email)
        .maybeSingle();
      
      if (customerFetchError) {
        console.error('Error fetching customer by email:', customerFetchError);
      } else if (existingCustomer) {
        customerId = existingCustomer.id;
        console.log('Found customer ID by email:', customerId);
      }
    }
    
    // If still no customer ID, create a new customer
    if (!customerId) {
      console.log('Creating new customer record');
      const customerRecord = {
        first_name: orderData.first_name,
        last_name: orderData.last_name,
        email: orderData.email,
        phone: orderData.phone,
        address: orderData.address,
        city: orderData.city,
        state: orderData.state,
        zip: orderData.zip
      };
      
      // If user is logged in, associate customer with user
      if (session?.user) {
        customerRecord.user_id = session.user.id;
      }
      
      const { data: newCustomer, error: customerCreateError } = await supabaseAdmin
        .from('customers')
        .insert(customerRecord)
        .select()
        .single();
      
      if (customerCreateError) {
        console.error('Error creating customer:', customerCreateError);
        return json({ error: 'Failed to create customer record' }, { status: 500 });
      }
      
      customerId = newCustomer.id;
      console.log('Created new customer with ID:', customerId);
    }
    
    // Format data for database - only include fields that exist in the table
    const orderRecord = {
      customer_id: customerId,
      first_name: orderData.first_name,
      last_name: orderData.last_name,
      email: orderData.email,
      phone: orderData.phone,
      service_id: orderData.service_id,
      location_id: orderData.location_id,
      weight: orderData.weight,
      total_price: orderData.total_price,
      status: 'pending',
      drop_off_date: orderData.drop_off_date,
      drop_off_time: orderData.drop_off_time,
      payment_intent_id: orderData.payment_intent_id,
      payment_method: orderData.payment_method,
      tip_amount: orderData.tip_amount || 0,
      promo_code: orderData.promo_code || null,
      discount_amount: orderData.discount_amount || 0
    };
    
    // Add optional fields if they exist in the order data
    if (orderData.address) orderRecord.address = orderData.address;
    if (orderData.city) orderRecord.city = orderData.city;
    if (orderData.state) orderRecord.state = orderData.state;
    if (orderData.zip) orderRecord.zip = orderData.zip;
    if (orderData.notes) orderRecord.notes = orderData.notes;
    if (orderData.preferences) orderRecord.preferences = orderData.preferences;
    if (orderData.items) orderRecord.items = orderData.items;
    if (orderData.pickup_requested !== undefined) orderRecord.pickup_requested = orderData.pickup_requested;
    if (orderData.pickup_date) orderRecord.pickup_date = orderData.pickup_date;
    if (orderData.pickup_time) orderRecord.pickup_time = orderData.pickup_time;
    
    // If user is logged in, associate order with user
    if (session?.user) {
      orderRecord.user_id = session.user.id;
    }
    
    console.log('Inserting order record:', orderRecord);
    
    // Insert order into database using the admin client
    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert(orderRecord)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating order:', error);
      return json({ error: error.message }, { status: 500 });
    }
    
    console.log('Order created successfully, data:', data);
    
    // Return success response with order ID
    return json({
      success: true,
      id: data.id,
      orderId: data.id,
      message: 'Order created successfully'
    });
    
  } catch (error) {
    console.error('Order creation error:', error);
    return json({ 
      error: 'Failed to create order. Please try again.' 
    }, { status: 500 });
  }
} 