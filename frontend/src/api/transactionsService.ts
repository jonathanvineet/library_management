import client from './client';

export const getTransactions = () => client.get('/transactions');

export const createTransaction = (transactionData: any) => client.post('/transactions', transactionData);
