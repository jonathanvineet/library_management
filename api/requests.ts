import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:tkt@vav@vj@u1@db.hnpgjwbhndackowriqau.supabase.co:5432/postgres?sslmode=require',
});

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const result = await pool.query(`
        SELECT id, book_id as "bookId", user_id as "userId", status, requested_at as "requestDate", processed_at as "responseDate"
        FROM book_requests
        ORDER BY requested_at DESC
      `);
      return res.status(200).json(result.rows);
    } else if (req.method === 'POST') {
      const { bookId, userId } = req.body;
      if (!bookId || !userId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await pool.query(`
        INSERT INTO book_requests (book_id, user_id, status, requested_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING id, book_id as "bookId", user_id as "userId", status, requested_at as "requestDate", processed_at as "responseDate"
      `, [bookId, userId, 'PENDING']);

      return res.status(201).json(result.rows[0]);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Requests error:', error);
    res.status(500).json({ error: error.message });
  }
}
