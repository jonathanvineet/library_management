import client from './client';

export const getRequests = () => client.get('/requests');

export const createRequest = (requestData: any) => client.post('/requests', requestData);
