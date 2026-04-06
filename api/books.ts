import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:tkt@vav@vj@u1@db.hnpgjwbhndackowriqau.supabase.co:5432/postgres?sslmode=require',
});

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const result = await pool.query(`
        SELECT id, title, author, isbn, genre, total_copies, available_copies, return_period_days, created_at
        FROM books
        ORDER BY created_at DESC
      `);
      res.status(200).json(result.rows);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, author, isbn, category, totalCopies, availableCopies, returnPeriodDays } = req.body;

      if (!title || !author || !totalCopies) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await pool.query(`
        INSERT INTO books (title, author, isbn, genre, total_copies, available_copies, return_period_days, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        RETURNING id, title, author, isbn, genre, total_copies, available_copies, return_period_days, created_at
      `, [title, author, isbn, category, totalCopies, availableCopies || totalCopies, returnPeriodDays || 14]);

      res.status(201).json(result.rows[0]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
