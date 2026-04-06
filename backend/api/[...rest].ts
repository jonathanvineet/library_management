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

// CORS configuration
const corsOptions = {
  origin: 'https://library-management-14.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS to all routes
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Add custom CORS headers as fallback
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://library-management-14.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

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

// Export as Vercel serverless handler
export default (req: VercelRequest, res: VercelResponse) => {
  app(req, res);
};
