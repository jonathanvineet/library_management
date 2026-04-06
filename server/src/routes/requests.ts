import express, { Router, Request, Response } from 'express';
import pool from '../db.js';

const router = Router();

// Get all requests
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT id, book_id as "bookId", user_id as "userId", status, requested_at as "requestDate", processed_at as "responseDate"
      FROM book_requests
      ORDER BY requested_at DESC
    `);
    res.json(result.rows);
  } catch (error: any) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get request by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, book_id as "bookId", user_id as "userId", status, requested_at as "requestDate", processed_at as "responseDate" FROM book_requests WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error fetching request:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create request
router.post('/', async (req: Request, res: Response) => {
  try {
    const { bookId, userId } = req.body;

    if (!bookId || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(`
      INSERT INTO book_requests (book_id, user_id, status, requested_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id, book_id as "bookId", user_id as "userId", status, requested_at as "requestDate", processed_at as "responseDate"
    `, [bookId, userId, 'PENDING']);

    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error creating request:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update request
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const result = await pool.query(`
      UPDATE book_requests 
      SET status = $1, processed_at = NOW()
      WHERE id = $2
      RETURNING id, book_id as "bookId", user_id as "userId", status, requested_at as "requestDate", processed_at as "responseDate"
    `, [status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating request:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
