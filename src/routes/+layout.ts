import { locations } from '$lib/stores';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch }) => {
  try {
    const response = await fetch('/api/locations');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Update the store with fetched locations
    locations.set(data);
    
    return {
      locations: data
    };
  } catch (error) {
    console.error('Error loading locations:', error);
    // Return empty array to prevent errors
    return {
      locations: []
    };
  }
}; 