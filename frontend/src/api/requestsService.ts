import apiClient from '@/api/client';
import type { BookRequest } from '@/types';

export const requestsService = {
  getPending: async (): Promise<BookRequest[]> => {
    const { data } = await apiClient.get('/book-requests/pending');
    return data;
  },
  getByMember: async (memberOrUserId: string | number): Promise<BookRequest[]> => {
    const { data } = await apiClient.get(`/book-requests/member/${memberOrUserId}`);
    return data;
  },
  create: async (payload: { bookId: string | number }): Promise<BookRequest> => {
    // Convert bookId to number if it's a string
    const bookIdNum = typeof payload.bookId === 'string' ? parseInt(payload.bookId, 10) : payload.bookId;
    const { data } = await apiClient.post('/book-requests/request', { bookId: bookIdNum });
    return data;
  },
  approve: async (requestId: string | number): Promise<BookRequest> => {
    const { data } = await apiClient.put(`/book-requests/${requestId}/approve`, {});
    return data;
  },
  reject: async (requestId: string | number, reason: string): Promise<BookRequest> => {
    const { data } = await apiClient.put(`/book-requests/${requestId}/reject`, { reason });
    return data;
  },
};
