import client from './client';

export const getBooks = () => client.get('/books');

export const createBook = (bookData: any) => client.post('/books', bookData);
