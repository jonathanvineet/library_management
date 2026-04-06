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
      const result = await pool.query('SELECT id, name, email, role FROM users ORDER BY id');
      return sendJSON(res, 200, result.rows);
    } else {
      return sendError(res, 405, 'Method not allowed');
    }
  } catch (error) {
    console.error('Members error:', error);
    return sendError(res, 500, 'Server error');
  }
};
