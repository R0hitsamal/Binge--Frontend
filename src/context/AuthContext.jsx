import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken]     = useState(localStorage.getItem('binge_token'));

  const loadProfile = useCallback(async () => {
    if (!localStorage.getItem('binge_token')) { setLoading(false); return; }
    try {
      const { data } = await authAPI.profile();
      setUser(data.user || data);
    } catch {
      localStorage.removeItem('binge_token');
      localStorage.removeItem('binge_user');
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  const login = async (credentials) => {
    const { data } = await authAPI.login(credentials);
    const tok = data.token;
    const usr = data.user || data;
    localStorage.setItem('binge_token', tok);
    localStorage.setItem('binge_user', JSON.stringify(usr));
    setToken(tok);
    setUser(usr);
    return usr;
  };

  const register = async (formData) => {
    const { data } = await authAPI.register(formData);
    const tok = data.token;
    const usr = data.user || data;
    if (tok) {
      localStorage.setItem('binge_token', tok);
      setToken(tok);
      setUser(usr);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('binge_token');
    localStorage.removeItem('binge_user');
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';
  const isAuth  = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, loading, token, isAdmin, isAuth, login, register, logout, loadProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
