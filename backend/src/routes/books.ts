import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM books ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, author, isbn, genre, totalCopies, availableCopies, returnPeriodDays } = req.body;

    if (!title || !author || !isbn) {
      return res.status(400).json({ error: 'Title, author, and ISBN required' });
    }

    const result = await pool.query(
      'INSERT INTO books (title, author, isbn, genre, total_copies, available_copies, return_period_days, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *',
      [title, author, isbn, genre, totalCopies || 1, availableCopies || totalCopies || 1, returnPeriodDays || 14]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
