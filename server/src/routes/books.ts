import express, { Router, Request, Response } from 'express';
import pool from '../db.js';

const router = Router();

// Get all books
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT id, title, author, isbn, genre, total_copies, available_copies, return_period_days, created_at
      FROM books
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (error: any) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get book by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, title, author, isbn, genre, total_copies, available_copies, return_period_days, created_at FROM books WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create book
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, author, isbn, category, totalCopies, availableCopies, returnPeriodDays } = req.body;

    if (!title || !author || !totalCopies) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(`
      INSERT INTO books (title, author, isbn, genre, total_copies, available_copies, return_period_days, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING id, title, author, isbn, genre, total_copies, available_copies, return_period_days, created_at
    `, [title, author, isbn, category, totalCopies, availableCopies || totalCopies, returnPeriodDays || 14]);

    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error creating book:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update book
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, author, isbn, category, totalCopies, availableCopies, returnPeriodDays } = req.body;

    const result = await pool.query(`
      UPDATE books 
      SET title = COALESCE($1, title),
          author = COALESCE($2, author),
          isbn = COALESCE($3, isbn),
          genre = COALESCE($4, genre),
          total_copies = COALESCE($5, total_copies),
          available_copies = COALESCE($6, available_copies),
          return_period_days = COALESCE($7, return_period_days)
      WHERE id = $8
      RETURNING id, title, author, isbn, genre, total_copies, available_copies, return_period_days, created_at
    `, [title, author, isbn, category, totalCopies, availableCopies, returnPeriodDays, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete book
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
