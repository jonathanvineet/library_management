import { VercelRequest, VercelResponse } from '@vercel/node';

export default (req: VercelRequest, res: VercelResponse) => {
  res.setHeader('Content-Type', 'image/x-icon');
  res.status(204).end();
};
