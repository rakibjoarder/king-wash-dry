import pg from 'pg';
import { DATABASE_URL } from '$env/static/private';

// Create a PostgreSQL pool
const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

/**
 * Database utility for executing queries
 */
export const db = {
  /**
   * Execute a SQL query with optional parameters
   * @param {string} text - SQL query text
   * @param {Array} params - Query parameters
   * @returns {Promise<Object>} - Query result
   */
  query: async (text, params = []) => {
    const client = await pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  },
  
  /**
   * Execute a transaction with multiple queries
   * @param {Function} callback - Transaction callback function that receives a client
   * @returns {Promise<any>} - Transaction result
   */
  transaction: async (callback) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}; 