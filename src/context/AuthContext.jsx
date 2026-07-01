import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('natura_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const isLoggedIn = currentUser !== null;
  const isAdmin = currentUser?.rol === 'admin';

  const login = useCallback(async (email, password) => {
    const res = await loginUser(email, password);
    const users = res.data;
    if (users.length === 0) throw new Error('Credenciales incorrectas');
    const user = users[0];
    setCurrentUser(user);
    localStorage.setItem('natura_user', JSON.stringify(user));
    return user;
  }, []);

  const registro = useCallback(async (userData) => {
    const res = await registerUser(userData);
    const newUser = res.data;
    setCurrentUser(newUser);
    localStorage.setItem('natura_user', JSON.stringify(newUser));
    return newUser;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('natura_user');
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isLoggedIn, isAdmin, login, registro, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
