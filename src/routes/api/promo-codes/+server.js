import { json } from '@sveltejs/kit';
import { dev } from '$app/environment';

// Import the real or mock database based on environment
const { db } = dev 
  ? await import('$lib/server/database.mock.js')
  : await import('$lib/server/database.js');

/**
 * GET handler for fetching promo codes
 */
export async function GET({ request }) {
  try {
    // Query to get active promo codes that haven't expired
    const query = `
      SELECT id, code, description, discount_type, discount_value, 
             min_order_amount, max_discount_amount, expiry_date
      FROM promo_codes
      WHERE is_active = TRUE
        AND (expiry_date IS NULL OR expiry_date >= CURRENT_DATE)
        AND (usage_limit IS NULL OR usage_count < usage_limit)
      ORDER BY created_at DESC
    `;
    
    const result = await db.query(query);
    
    return json(result.rows);
  } catch (error) {
    console.error('Error fetching promo codes:', error);
    return json({ error: 'Failed to fetch promo codes' }, { status: 500 });
  }
} 