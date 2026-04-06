import { VercelResponse } from '@vercel/node';

export function setCORSHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return res;
}

export function sendJSON(res: VercelResponse, status: number, data: any) {
  setCORSHeaders(res);
  res.status(status).json(data);
}

export function sendError(res: VercelResponse, status: number, message: string) {
  setCORSHeaders(res);
  res.status(status).json({ error: message });
}
