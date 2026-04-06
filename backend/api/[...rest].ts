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

// CORS configuration - allow all origins for now
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

// Routes - note: Express will receive request path without /api prefix
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
  res.json({ message: 'Library Management API' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Export as Vercel serverless handler
export default (req: VercelRequest, res: VercelResponse) => {
  app(req, res);
};

