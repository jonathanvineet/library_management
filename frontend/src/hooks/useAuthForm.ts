import { useState } from 'react';
import { login as apiLogin, register as apiRegister } from '../api/authService';
import { useAuth } from './useAuth';

export function useAuthForm() {
  const { login: setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const response = await apiLogin(email, password);
        setUser(response.data);
      } else {
        const response = await apiRegister(name, email, password);
        setUser(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    isLogin,
    setIsLogin,
    loading,
    error,
    handleSubmit,
  };
}
