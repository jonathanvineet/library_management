import apiClient from '@/api/client';
import type { Book, BookFormData } from '@/types';

export const booksService = {
  getAll: async (): Promise<Book[]> => {
    const { data } = await apiClient.get('/books');
    return data;
  },
  getById: async (id: string): Promise<Book> => {
    const { data } = await apiClient.get(`/books/${id}`);
    return data;
  },
  create: async (book: BookFormData): Promise<Book> => {
    const { data } = await apiClient.post('/books', book);
    return data;
  },
  update: async (id: string, book: BookFormData): Promise<Book> => {
    const { data } = await apiClient.put(`/books/${id}`, book);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/books/${id}`);
  },
};
