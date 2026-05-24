import { useState, type ReactNode } from 'react';
import api from '../api/axiosInstance';
import { AuthContext } from './AuthContext';

interface User {
  name: string;
  role: string;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const name = localStorage.getItem('name');
    const role = localStorage.getItem('role');
    return name && role ? { name, role } : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const response = await api.post('/api/auth/staff-login', credentials);
      const { token, user: userFromApi } = response.data;
      const name = userFromApi?.name || '';
      const role = userFromApi?.role || '';
      if (token) localStorage.setItem('token', token);
      localStorage.setItem('name', name);
      localStorage.setItem('role', role);
      setUser({ name, role });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
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
