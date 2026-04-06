import { VercelRequest, VercelResponse } from '@vercel/node';
import pool from '../../lib/db';
import { hashPassword } from '../../lib/auth';
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
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 400, 'Name, email, and password required');
    }

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return sendError(res, 409, 'Email already registered');
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, 'member']
    );

    const user = result.rows[0];
    return sendJSON(res, 201, {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Register error:', error);
    return sendError(res, 500, 'Server error');
  }
};
