import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabase';

export const GET: RequestHandler = async ({ url }) => {
  // Get the query parameter for including inactive locations
  const includeInactive = url.searchParams.get('includeInactive') === 'true';
  
  // Create the query
  let query = supabase
    .from('locations')
    .select('*')
    .order('city');
  
  // Add the is_active filter if needed
  if (!includeInactive) {
    query = query.eq('is_active', true);
  }
  
  // Execute the query
  const { data, error } = await query;
  
  // Handle errors
  if (error) {
    console.error('Error fetching locations:', error);
    return json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
  
  return json(data);
}; 