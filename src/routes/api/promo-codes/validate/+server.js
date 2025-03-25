import { json } from '@sveltejs/kit';
import { dev } from '$app/environment';

// Import the real or mock database based on environment
const { db } = dev 
  ? await import('$lib/server/database.mock.js')
  : await import('$lib/server/database.js');

/**
 * POST handler for validating a promo code
 */
export async function POST({ request }) {
  try {
    const { code, orderAmount } = await request.json();
    
    if (!code) {
      return json({ valid: false, message: 'No promo code provided' }, { status: 400 });
    }
    
    // Query to get the promo code details
    const query = `
      SELECT id, code, description, discount_type, discount_value, 
             min_order_amount, max_discount_amount, expiry_date
      FROM promo_codes
      WHERE code = $1
        AND is_active = TRUE
        AND (expiry_date IS NULL OR expiry_date >= CURRENT_DATE)
        AND (usage_limit IS NULL OR usage_count < usage_limit)
    `;
    
    const result = await db.query(query, [code]);
    
    if (result.rows.length === 0) {
      return json({ valid: false, message: 'Invalid or expired promo code' });
    }
    
    const promoCode = result.rows[0];
    
    // Check minimum order amount
    if (orderAmount < promoCode.min_order_amount) {
      return json({ 
        valid: false, 
        message: `This code requires a minimum order of $${promoCode.min_order_amount.toFixed(2)}` 
      });
    }
    
    // Calculate discount amount
    let discountAmount;
    if (promoCode.discount_type === 'percentage') {
      discountAmount = orderAmount * (promoCode.discount_value / 100);
      
      // Apply maximum discount if specified
      if (promoCode.max_discount_amount && discountAmount > promoCode.max_discount_amount) {
        discountAmount = promoCode.max_discount_amount;
      }
    } else {
      // Fixed amount discount
      discountAmount = promoCode.discount_value;
    }
    
    return json({
      valid: true,
      promoCode: {
        ...promoCode,
        discountAmount
      }
    });
  } catch (error) {
    console.error('Error validating promo code:', error);
    return json({ valid: false, message: 'Failed to validate promo code' }, { status: 500 });
  }
} 