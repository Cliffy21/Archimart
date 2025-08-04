
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Set this in your .env.local
  // Or use user, host, database, password, port individually
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;

  // Validate ID
  if (!id) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  try {
    // Try to parse ID as integer (adjust if you use UUIDs)
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    // Query PostgreSQL for the product
    const query = 'SELECT * FROM products WHERE id = $1';
    const { rows } = await pool.query(query, [productId]);

    if (rows.length === 0) {
      return res.status(404).json({ 
        message: 'Product not found',
        requestedId: id
      });
    }

    // Success response
    return res.status(200).json(rows[0]);

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      message: 'Database operation failed',
      error: error.message,
      requestedId: id
    });
  }
}
