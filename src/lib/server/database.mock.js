// Mock promo codes data
const promoCodes = [
  {
    id: 1,
    code: 'WELCOME10',
    description: 'Welcome discount for new customers',
    discount_type: 'percentage',
    discount_value: 10.00,
    min_order_amount: 0,
    max_discount_amount: 50.00,
    expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    is_active: true
  },
  {
    id: 2,
    code: 'SUMMER2023',
    description: 'Summer special discount',
    discount_type: 'percentage',
    discount_value: 15.00,
    min_order_amount: 25.00,
    max_discount_amount: 75.00,
    expiry_date: new Date('2023-09-30'),
    is_active: true
  },
  {
    id: 3,
    code: 'FREESHIP',
    description: 'Free delivery on your order',
    discount_type: 'fixed',
    discount_value: 5.00,
    min_order_amount: 20.00,
    max_discount_amount: null,
    expiry_date: new Date('2023-12-31'),
    is_active: true
  },
  {
    id: 4,
    code: 'SAVE20',
    description: 'Save $20 on orders over $100',
    discount_type: 'fixed',
    discount_value: 20.00,
    min_order_amount: 100.00,
    max_discount_amount: null,
    expiry_date: new Date('2023-12-31'),
    is_active: true
  }
];

/**
 * Mock database utility for testing
 */
export const db = {
  /**
   * Execute a mock query
   * @param {string} text - SQL query text
   * @param {Array} params - Query parameters
   * @returns {Promise<Object>} - Mock query result
   */
  query: async (text, params = []) => {
    console.log('Mock DB Query:', { text, params });
    
    // Handle promo codes queries
    if (text.includes('FROM promo_codes')) {
      // If it's a query to get all active promo codes
      if (text.includes('is_active = TRUE') && !params.length) {
        return {
          rows: promoCodes.filter(code => 
            code.is_active && 
            (!code.expiry_date || new Date(code.expiry_date) >= new Date())
          )
        };
      }
      
      // If it's a query to get a specific promo code
      if (params.length === 1) {
        const code = params[0];
        const matchedPromo = promoCodes.find(
          p => p.code.toLowerCase() === code.toLowerCase() && 
               p.is_active && 
               (!p.expiry_date || new Date(p.expiry_date) >= new Date())
        );
        
        return {
          rows: matchedPromo ? [matchedPromo] : []
        };
      }
    }
    
    return { rows: [] };
  },
  
  /**
   * Execute a mock transaction
   * @param {Function} callback - Transaction callback function
   * @returns {Promise<any>} - Mock transaction result
   */
  transaction: async (callback) => {
    console.log('Mock DB Transaction');
    const mockClient = {
      query: async (text, params = []) => db.query(text, params)
    };
    return await callback(mockClient);
  }
}; 