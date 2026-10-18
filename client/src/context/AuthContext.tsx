import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('prepmate_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('prepmate_token');
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('prepmate_token');
      if (storedToken) {
        try {
          const res = await axiosClient.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('prepmate_user', JSON.stringify(res.data));
        } catch (err) {
          console.error('Failed to authenticate stored token:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await axiosClient.post('/auth/login', { email, password });
    const { token: receivedToken, ...userData } = res.data;
    setToken(receivedToken);
    setUser(userData);
    localStorage.setItem('prepmate_token', receivedToken);
    localStorage.setItem('prepmate_user', JSON.stringify(userData));
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await axiosClient.post('/auth/register', { name, email, password });
    const { token: receivedToken, ...userData } = res.data;
    setToken(receivedToken);
    setUser(userData);
    localStorage.setItem('prepmate_token', receivedToken);
    localStorage.setItem('prepmate_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('prepmate_token');
    localStorage.removeItem('prepmate_user');
  };

  const refreshUser = async () => {
    try {
      const res = await axiosClient.get('/auth/me');
      setUser(res.data);
      localStorage.setItem('prepmate_user', JSON.stringify(res.data));
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
