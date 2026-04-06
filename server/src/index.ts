import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import booksRoutes from './routes/books.js';
import membersRoutes from './routes/members.js';
import requestsRoutes from './routes/requests.js';
import transactionsRoutes from './routes/transactions.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Routes
app.use('/api/users', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/transactions', transactionsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
