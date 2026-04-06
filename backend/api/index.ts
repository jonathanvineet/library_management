import { VercelRequest, VercelResponse } from '@vercel/node';
import { setCORSHeaders } from '../lib/response';

export default (req: VercelRequest, res: VercelResponse) => {
  setCORSHeaders(res);
  res.status(200).json({ 
    message: 'Library Management API',
    endpoints: {
      auth: { login: 'POST /api/auth/login', register: 'POST /api/auth/register' },
      books: 'GET/POST /api/books',
      members: 'GET /api/members',
      requests: 'GET/POST /api/requests',
      transactions: 'GET/POST /api/transactions',
      health: 'GET /api/health'
    }
  });
};
