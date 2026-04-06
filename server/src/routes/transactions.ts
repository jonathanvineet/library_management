import express, { Router, Request, Response } from 'express';
import pool from '../db.js';

const router = Router();

// Get all transactions
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT id, book_id as "bookId", member_id as "memberId", borrow_date as "borrowDate", 
             due_date as "dueDate", return_date as "returnDate", status, fine_amount as "fineAmount", 
             notes, created_at as "createdAt"
      FROM transactions
      ORDER BY borrow_date DESC
    `);
    res.json(result.rows);
  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get transaction by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT id, book_id as "bookId", member_id as "memberId", borrow_date as "borrowDate", 
             due_date as "dueDate", return_date as "returnDate", status, fine_amount as "fineAmount", 
             notes, created_at as "createdAt"
      FROM transactions WHERE id = $1
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create transaction
router.post('/', async (req: Request, res: Response) => {
  try {
    const { bookId, memberId, borrowDate, dueDate, status, notes } = req.body;

    if (!bookId || !memberId || !borrowDate || !dueDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(`
      INSERT INTO transactions (book_id, member_id, borrow_date, due_date, status, notes, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING id, book_id as "bookId", member_id as "memberId", borrow_date as "borrowDate", 
               due_date as "dueDate", return_date as "returnDate", status, fine_amount as "fineAmount", 
               notes, created_at as "createdAt"
    `, [bookId, memberId, borrowDate, dueDate, status || 'BORROWED', notes]);

    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update transaction
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, returnDate, fineAmount, notes } = req.body;

    const result = await pool.query(`
      UPDATE transactions 
      SET status = COALESCE($1, status),
          return_date = COALESCE($2, return_date),
          fine_amount = COALESCE($3, fine_amount),
          notes = COALESCE($4, notes)
      WHERE id = $5
      RETURNING id, book_id as "bookId", member_id as "memberId", borrow_date as "borrowDate", 
               due_date as "dueDate", return_date as "returnDate", status, fine_amount as "fineAmount", 
               notes, created_at as "createdAt"
    `, [status, returnDate, fineAmount, notes, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
