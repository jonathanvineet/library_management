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
      const result = await pool.query('SELECT * FROM books ORDER BY id');
      return sendJSON(res, 200, result.rows);
    } else if (req.method === 'POST') {
      const { title, author, isbn, availableCopies } = req.body;
      
      if (!title || !author) {
        return sendError(res, 400, 'Title and author required');
      }

      const result = await pool.query(
        'INSERT INTO books (title, author, isbn, available_copies) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, author, isbn || null, availableCopies || 1]
      );

      return sendJSON(res, 201, result.rows[0]);
    } else {
      return sendError(res, 405, 'Method not allowed');
    }
  } catch (error) {
    console.error('Books error:', error);
    return sendError(res, 500, 'Server error');
  }
};
