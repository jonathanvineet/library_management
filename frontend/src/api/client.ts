import axios, { AxiosError } from 'axios';
import type { ApiError } from '@/types';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const auth = sessionStorage.getItem('authCredentials');
  if (auth) {
    config.headers.Authorization = `Basic ${auth}`;
  }
  
  // Add userId header for authenticated requests
  const userId = sessionStorage.getItem('userId');
  if (userId) {
    config.headers['X-User-Id'] = userId;
  }
  
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url || '';

    // Only redirect on 401/403 for non-auth endpoints
    if ((status === 401 || status === 403) && !url.includes('/auth/')) {
      sessionStorage.clear();
      window.location.href = '/login';
    }
    const apiError: ApiError = {
      message: (error.response?.data as any)?.message || error.message || 'An unexpected error occurred',
      status: status || 500,
      details: (error.response?.data as any)?.details,
    };
    return Promise.reject(apiError);
  }
);

export default apiClient;
