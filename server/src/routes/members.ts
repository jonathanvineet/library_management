import express, { Router, Request, Response } from 'express';
import pool from '../db.js';

const router = Router();

// Get all members
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT id, name, email, role, created_at as "createdAt"
      FROM users
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (error: any) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get member by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, name, email, role, created_at as "createdAt" FROM users WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error fetching member:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update member
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const result = await pool.query(`
      UPDATE users 
      SET name = COALESCE($1, name),
          email = COALESCE($2, email),
          role = COALESCE($3, role)
      WHERE id = $4
      RETURNING id, name, email, role, created_at as "createdAt"
    `, [name, email, role, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating member:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
