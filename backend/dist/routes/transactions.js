"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const result = await db_1.default.query('SELECT * FROM transactions ORDER BY borrow_date DESC');
        const rows = result.rows.map((row) => ({
            id: row.id,
            bookId: row.book_id,
            memberId: row.member_id,
            borrowDate: row.borrow_date,
            dueDate: row.due_date,
            returnDate: row.return_date,
            status: row.status,
        }));
        res.json(rows);
    }
    catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
router.post('/', async (req, res) => {
    try {
        const { bookId, memberId, borrowDate, dueDate } = req.body;
        if (!bookId || !memberId || !borrowDate || !dueDate) {
            return res.status(400).json({ error: 'Book ID, member ID, borrow date, and due date required' });
        }
        const result = await db_1.default.query('INSERT INTO transactions (book_id, member_id, borrow_date, due_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *', [bookId, memberId, borrowDate, dueDate, 'BORROWED']);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error('Create transaction error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=transactions.js.map