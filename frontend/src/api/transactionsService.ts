import apiClient from '@/api/client';
import type { Transaction } from '@/types';

export const transactionsService = {
  getAll: async (): Promise<Transaction[]> => {
    const { data } = await apiClient.get('/transactions');
    return data;
  },
  getByMember: async (memberId: string | number): Promise<Transaction[]> => {
    const { data } = await apiClient.get(`/transactions/member/${memberId}`);
    return data;
  },
  borrow: async (payload: { bookId: string; memberId: string }): Promise<Transaction> => {
    const { data } = await apiClient.post('/transactions/borrow', payload);
    return data;
  },
  returnBook: async (transactionId: string | number): Promise<Transaction> => {
    const { data } = await apiClient.put(`/transactions/${transactionId}/return`);
    return data;
  },
  approveReturn: async (transactionId: string | number): Promise<Transaction> => {
    const { data } = await apiClient.put(`/transactions/${transactionId}/approve-return`);
    return data;
  },
  payFine: async (transactionId: string | number): Promise<Transaction> => {
    const { data} = await apiClient.put(`/transactions/${transactionId}/pay-fine`);
    return data;
  },
};
