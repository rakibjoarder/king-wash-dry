import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
  try {
    // Check if user is authenticated
    if (!locals.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Fetch customer data from the database
    const { data: customer, error } = await locals.supabase
      .from('customers')
      .select('*')
      .eq('user_id', locals.user.id)
      .single();

    if (error) {
      console.error('Error fetching customer:', error);
      return new Response('Error fetching customer data', { status: 500 });
    }

    if (!customer) {
      return new Response('Customer not found', { status: 404 });
    }

    return json(customer);
  } catch (error) {
    console.error('Error in GET /api/order-customer:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};

export const PATCH: RequestHandler = async ({ request, locals }) => {
  try {
    // Check if user is authenticated
    if (!locals.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Get the request body
    const body = await request.json();
    const { address, city, zip } = body;

    // Validate required fields
    if (!address || !city || !zip) {
      return new Response('Missing required fields', { status: 400 });
    }

    // Update customer data in the database
    const { data: customer, error } = await locals.supabase
      .from('customers')
      .update({
        address,
        city,
        zip
      })
      .eq('user_id', locals.user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating customer:', error);
      return new Response('Error updating customer data', { status: 500 });
    }

    if (!customer) {
      return new Response('Customer not found', { status: 404 });
    }

    return json(customer);
  } catch (error) {
    console.error('Error in PATCH /api/order-customer:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}; 