import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request, locals }) => {
  try {
    // Check if user is authenticated
    if (!locals.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Get order ID from URL
    const url = new URL(request.url);
    const orderId = url.searchParams.get('id');

    if (!orderId) {
      return new Response('Order ID is required', { status: 400 });
    }

    // Fetch order data with service join
    const { data: order, error } = await locals.supabase
      .from('orders')
      .select(`
        *,
        service:services(id, name)
      `)
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return new Response('Error fetching order data', { status: 500 });
    }

    if (!order) {
      return new Response('Order not found', { status: 404 });
    }

    // Parse JSON fields if they exist
    if (order.items && typeof order.items === 'string') {
      order.items = JSON.parse(order.items);
    }

    if (order.preferences && typeof order.preferences === 'string') {
      order.preferences = JSON.parse(order.preferences);
    }

    return json(order);
  } catch (error) {
    console.error('Error in GET /api/order-confirmation:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}; 