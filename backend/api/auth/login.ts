import { VercelRequest, VercelResponse } from '@vercel/node';
import pool from '../../lib/db';
import { comparePassword } from '../../lib/auth';
import { sendJSON, sendError, setCORSHeaders } from '../../lib/response';

export default async (req: VercelRequest, res: VercelResponse) => {
  setCORSHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Email and password required');
    }

    const result = await pool.query(
      'SELECT id, name, email, password_hash, role FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return sendError(res, 401, 'Invalid email or password');
    }

    const user = result.rows[0];
    const passwordMatch = await comparePassword(password, user.password_hash);

    if (!passwordMatch) {
      return sendError(res, 401, 'Invalid email or password');
    }

    return sendJSON(res, 200, {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Login error:', error);
    return sendError(res, 500, 'Server error');
  }
};
