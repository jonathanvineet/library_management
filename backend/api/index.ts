import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from '../src/routes/auth';
import booksRoutes from '../src/routes/books';
import membersRoutes from '../src/routes/members';
import requestsRoutes from '../src/routes/requests';
import transactionsRoutes from '../src/routes/transactions';

dotenv.config();

const app = express();

// CORS - allow all origins
app.use(cors({ origin: '*' }));
app.options('*', cors());

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/books', booksRoutes);
app.use('/members', membersRoutes);
app.use('/requests', requestsRoutes);
app.use('/transactions', transactionsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Root
app.get('/', (req, res) => {
  res.json({ message: 'Library Management API', path: req.path });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

export default (req: VercelRequest, res: VercelResponse) => {
  app(req, res);
};
