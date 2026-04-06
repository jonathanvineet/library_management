import { VercelRequest, VercelResponse } from '@vercel/node';
import { sendJSON, setCORSHeaders } from '../lib/response';

export default (req: VercelRequest, res: VercelResponse) => {
  setCORSHeaders(res);
  return sendJSON(res, 200, { status: 'ok' });
};
