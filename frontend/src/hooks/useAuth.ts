import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/api/authService';
import type { LoginDTO, User, UserRole } from '@/types';

export const getStoredUser = (): User | null => {
  const data = sessionStorage.getItem('user');
  return data ? JSON.parse(data) : null;
};

export const getStoredRole = (): UserRole | null => {
  return (sessionStorage.getItem('userRole') as UserRole) || null;
};

export const isAuthenticated = (): boolean => {
  return !!sessionStorage.getItem('authCredentials');
};

export const useAuth = () => {
  const navigate = useNavigate();

  const user = getStoredUser();
  const role = getStoredRole();

  const login = useCallback(async (credentials: LoginDTO) => {
    const response = await authService.login(credentials);
    
    // Map backend response to frontend User type
    const userData: User = {
      userId: response.userId || String(response.id),
      username: response.username || response.email,
      fullName: response.fullName || response.name,
      email: response.email,
      role: response.role as UserRole
    };

    const token = btoa(`${credentials.username}:${credentials.password}`);
    sessionStorage.setItem('authCredentials', token);
    sessionStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('userRole', userData.role);
    sessionStorage.setItem('username', userData.username);
    sessionStorage.setItem('fullName', userData.fullName);
    sessionStorage.setItem('email', userData.email);
    sessionStorage.setItem('userId', userData.userId);

    navigate(userData.role === 'LIBRARIAN' ? '/dashboard' : '/dashboard');
    return userData;
  }, [navigate]);

  const logout = useCallback(() => {
    sessionStorage.clear();
    navigate('/login');
  }, [navigate]);

  return { user, role, login, logout, isAuthenticated: isAuthenticated() };
};
