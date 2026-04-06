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
        const result = await db_1.default.query('SELECT * FROM books ORDER BY created_at DESC');
        res.json(result.rows);
    }
    catch (error) {
        console.error('Get books error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
router.post('/', async (req, res) => {
    try {
        const { title, author, isbn, genre, totalCopies, availableCopies, returnPeriodDays } = req.body;
        if (!title || !author || !isbn) {
            return res.status(400).json({ error: 'Title, author, and ISBN required' });
        }
        const result = await db_1.default.query('INSERT INTO books (title, author, isbn, genre, total_copies, available_copies, return_period_days, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *', [title, author, isbn, genre, totalCopies || 1, availableCopies || totalCopies || 1, returnPeriodDays || 14]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error('Create book error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=books.js.map