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
      const result = await pool.query('SELECT * FROM book_requests ORDER BY id DESC');
      return sendJSON(res, 200, result.rows);
    } else if (req.method === 'POST') {
      const { userId, bookId, requestDate, status } = req.body;

      if (!userId || !bookId) {
        return sendError(res, 400, 'User ID and Book ID required');
      }

      const result = await pool.query(
        'INSERT INTO book_requests (user_id, book_id, request_date, status) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId, bookId, requestDate || new Date(), status || 'pending']
      );

      return sendJSON(res, 201, result.rows[0]);
    } else {
      return sendError(res, 405, 'Method not allowed');
    }
  } catch (error) {
    console.error('Requests error:', error);
    return sendError(res, 500, 'Server error');
  }
};
