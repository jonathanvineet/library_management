import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM book_requests ORDER BY request_date DESC');
    const rows = result.rows.map((row: any) => ({
      id: row.id,
      bookId: row.book_id,
      userId: row.user_id,
      requestDate: row.request_date,
      responseDate: row.response_date,
      status: row.status,
    }));
    res.json(rows);
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { bookId, userId } = req.body;

    if (!bookId || !userId) {
      return res.status(400).json({ error: 'Book ID and user ID required' });
    }

    const result = await pool.query(
      'INSERT INTO book_requests (book_id, user_id, request_date, status) VALUES ($1, $2, NOW(), $3) RETURNING *',
      [bookId, userId, 'PENDING']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
