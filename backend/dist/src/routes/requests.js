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
        const result = await db_1.default.query('SELECT * FROM book_requests ORDER BY request_date DESC');
        const rows = result.rows.map((row) => ({
            id: row.id,
            bookId: row.book_id,
            userId: row.user_id,
            requestDate: row.request_date,
            responseDate: row.response_date,
            status: row.status,
        }));
        res.json(rows);
    }
    catch (error) {
        console.error('Get requests error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
router.post('/', async (req, res) => {
    try {
        const { bookId, userId } = req.body;
        if (!bookId || !userId) {
            return res.status(400).json({ error: 'Book ID and user ID required' });
        }
        const result = await db_1.default.query('INSERT INTO book_requests (book_id, user_id, request_date, status) VALUES ($1, $2, NOW(), $3) RETURNING *', [bookId, userId, 'PENDING']);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error('Create request error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=requests.js.map