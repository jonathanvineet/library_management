import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import booksRoutes from './routes/books';
import membersRoutes from './routes/members';
import requestsRoutes from './routes/requests';
import transactionsRoutes from './routes/transactions';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://library-management-14.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
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
