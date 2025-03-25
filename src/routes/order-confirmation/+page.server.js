import { redirect } from '@sveltejs/kit';

export async function load({ url }) {
  const orderId = url.searchParams.get('id');
  
  if (!orderId) {
    throw redirect(302, '/');
  }
  
  return {
    orderId
  };
} 