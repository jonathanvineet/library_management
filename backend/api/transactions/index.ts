import { VercelRequest, VercelResponse } from '@vercel/node';
import pool from '../../lib/db';
import { sendJSON, sendError, setCORSHeaders } from '../../lib/response';

export default async (req: VercelRequest, res: VercelResponse) => {
  setCORSHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const result = await pool.query('SELECT * FROM transactions ORDER BY id DESC');
      return sendJSON(res, 200, result.rows);
    } else if (req.method === 'POST') {
      const { userId, bookId, transactionType, transactionDate } = req.body;

      if (!userId || !bookId || !transactionType) {
        return sendError(res, 400, 'User ID, Book ID, and Transaction Type required');
      }

      const result = await pool.query(
        'INSERT INTO transactions (user_id, book_id, transaction_type, transaction_date) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId, bookId, transactionType, transactionDate || new Date()]
      );

      return sendJSON(res, 201, result.rows[0]);
    } else {
      return sendError(res, 405, 'Method not allowed');
    }
  } catch (error) {
    console.error('Transactions error:', error);
    return sendError(res, 500, 'Server error');
  }
};
