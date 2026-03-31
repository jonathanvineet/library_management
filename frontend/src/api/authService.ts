import apiClient from '@/api/client';
import type { RegisterDTO, LoginDTO, User } from '@/types';

interface LoginResponse {
  id?: number;
  name?: string;
  email: string;
  role: string;
  // Legacy fields for compatibility
  message?: string;
  userId?: string;
  username?: string;
  fullName?: string;
}

export const authService = {
  login: async (credentials: LoginDTO): Promise<LoginResponse> => {
    // Backend expects email, not username
    const loginData = {
      email: credentials.username,  // Frontend uses 'username' field but backend expects 'email'
      password: credentials.password
    };
    const { data } = await apiClient.post('/users/login', loginData);
    return data;
  },
  
  register: async (data: RegisterDTO): Promise<void> => {
    // Map frontend fields to backend fields
    const backendData = {
      name: data.fullName,  // Backend expects 'name' not 'fullName'
      email: data.email,
      password: data.password,
      role: 'MEMBER'  // Default role
    };
    await apiClient.post('/users/register', backendData);
  },
  
  getCurrentUser: async (): Promise<User> => {
    const { data } = await apiClient.get('/auth/current-user');
    return data;
  },
  
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};
