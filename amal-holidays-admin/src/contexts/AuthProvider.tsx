import { useState, type ReactNode } from 'react';
import api from '../api/axiosInstance';
import { AuthContext } from './AuthContext';

interface User {
  user_id: number;
  name: string;
  role: string;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const user_id = localStorage.getItem('user_id');
    const name = localStorage.getItem('name');
    const role = localStorage.getItem('role');
    return user_id && name && role ? { user_id: Number(user_id), name, role } : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const response = await api.post('/api/auth/staff-login', credentials);
      const { token, user: userFromApi } = response.data;
      const user_id = userFromApi?.user_id || 0;
      const name = userFromApi?.name || '';
      const role = userFromApi?.role || '';
      if (token) localStorage.setItem('token', token);
      localStorage.setItem('user_id', String(user_id));
      localStorage.setItem('name', name);
      localStorage.setItem('role', role);
      setUser({ user_id, name, role });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
