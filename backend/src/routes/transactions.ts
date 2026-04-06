import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM transactions ORDER BY borrow_date DESC');
    const rows = result.rows.map((row: any) => ({
      id: row.id,
      bookId: row.book_id,
      memberId: row.member_id,
      borrowDate: row.borrow_date,
      dueDate: row.due_date,
      returnDate: row.return_date,
      status: row.status,
    }));
    res.json(rows);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { bookId, memberId, borrowDate, dueDate } = req.body;

    if (!bookId || !memberId || !borrowDate || !dueDate) {
      return res.status(400).json({ error: 'Book ID, member ID, borrow date, and due date required' });
    }

    const result = await pool.query(
      'INSERT INTO transactions (book_id, member_id, borrow_date, due_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [bookId, memberId, borrowDate, dueDate, 'BORROWED']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
