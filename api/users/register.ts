import pkg from 'pg';
import bcrypt from 'bcrypt';

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:tkt@vav@vj@u1@db.hnpgjwbhndackowriqau.supabase.co:5432/postgres?sslmode=require',
});

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export default async function handler(req: any, res: any) {
  // Set CORS headers first
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const hashedPassword = await hashPassword(password);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, role, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id, name, email, role',
      [name, email, hashedPassword, 'MEMBER']
    );

    const user = result.rows[0];
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error: any) {
    console.error('Register error:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: error.message });
  }
}
