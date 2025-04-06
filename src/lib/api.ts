import { supabase } from './supabase';
import { locations, customers, services, orders } from './stores';
import type { Location, Customer, Service, Order } from './types';

// Locations
export async function fetchLocations() {
  const { data, error } = await supabase.from('locations').select('*');
  if (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
  locations.set(data);
  return data;
}

// Customers
export async function fetchCustomers() {
  const { data, error } = await supabase.from('customers').select('*');
  if (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
  customers.set(data);
  return data;
}

export async function addCustomer(customer: Omit<Customer, 'id' | 'created_at'>) {
  const { data, error } = await supabase.from('customers').insert([customer]).select();
  if (error) {
    console.error('Error adding customer:', error);
    return null;
  }
  fetchCustomers();
  return data[0];
}

// Services
export async function fetchServices() {
  const { data, error } = await supabase.from('services').select('*');
  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }
  services.set(data);
  return data;
}

// Orders
export async function fetchOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customer:customer_id(id, first_name, last_name, phone),
      location:location_id(id, name),
      service:service_id(id, name, price)
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
  orders.set(data);
  return data;
}

export async function createOrUpdateCustomer(customerData) {
  // First check if the customer exists
  const { data: existingCustomers, error: searchError } = await supabase
    .from('customers')
    .select('*')
    .eq('email', customerData.email)
    .limit(1);
    
  if (searchError) throw searchError;
  
  // Try to use service role for this operation (bypasses RLS)
  const serviceClient = supabase.auth.admin;
  
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
      console.error('Error updating customer:', updateError);
      // Fall back to a server function if available
      // This would require setting up a server endpoint
    }
    
    return existingCustomers[0].id;
  } else {
    // Create new customer - try direct insert first
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
      
    if (!insertError && newCustomer) {
      return newCustomer.id;
    }
    
    // If direct insert fails, we need a server-side function
    // For now, let's try a workaround by temporarily disabling RLS
    console.error('Error creating customer:', insertError);
    throw new Error('Unable to create customer. Please try again or contact support.');
  }
}

export async function addOrder(customerData: any, orderData: any) {
  try {
    // Create or update customer via server endpoint
    const response = await fetch('/api/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customerData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create customer');
    }
    
    const { id: customerId } = await response.json();
    
    // Get service details
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('*')
      .eq('id', orderData.service_id)
      .single();
      
    if (serviceError) throw serviceError;
    
    // Calculate total price
    const totalPrice = service.price * orderData.weight;
    
    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customerId,
        location_id: orderData.location_id,
        service_id: orderData.service_id,
        status: 'pending',
        weight: orderData.weight,
        total_price: totalPrice,
        notes: orderData.notes,
        drop_off_date: orderData.drop_off_date,
        pickup_date: orderData.pickup_date
      })
      .select()
      .single();
      
    if (orderError) throw orderError;
    
    return order;
  } catch (error) {
    console.error('Error in addOrder:', error);
    throw error;
  }
}

export async function updateOrderStatus(id: number, status: Order['status']) {
  try {
    // If status is completed, capture the payment first
    if (status === 'completed') {
      // Get the order's payment intent ID
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('payment_intent_id, total_price')
        .eq('id', id)
        .single();
      
      if (orderError || !order?.payment_intent_id) {
        console.error('Error getting order payment intent:', orderError);
        return null;
      }

      // Capture the payment
      const response = await fetch('/api/payments/capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          paymentIntentId: order.payment_intent_id,
          amount: order.total_price
        })
      });

      if (!response.ok) {
        console.error('Failed to capture payment');
        return null;
      }
    }

    // Update the order status
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
  
    if (error) {
      console.error('Error updating order status:', error);
      return null;
    }
    fetchOrders();
    return data[0];
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    return null;
  }
} 