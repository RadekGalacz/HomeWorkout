import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const navigate = useNavigate();

  // Kontrola autentizace – načte uživatele ze serveru
  const checkAuth = useCallback(async () => {
    try {
      const { data } = await authApi.getUserInfo();
      setUser(data.userName || null);
      setRole(data.role?.toLowerCase() || null);
    } catch {
      setUser(null);
      setRole(null);
    } finally {
      setAuthChecked(true);
    }
  }, []);

  // Počáteční kontrola
  useEffect(() => {
    if (!authChecked) checkAuth();
  }, [authChecked, checkAuth]);

  // Přihlášení
  const handleLogin = useCallback(async (userData) => {
    if (typeof userData === 'object' && userData !== null) {
      setUser(userData.userName || userData.username || userData.Name || null);
      setRole((userData.role || userData.Role || '').toLowerCase());
      navigate('/');
    } else {
      await checkAuth();
      navigate('/');
    }
  }, [checkAuth, navigate]);

  // Odhlášení
  const handleLogout = useCallback(async () => {
    try {
      await authApi.logout();
      setUser(null);
      setRole(null);
      setAuthChecked(false);
      navigate('/login');
    } catch (error) {
      console.error('Chyba při odhlášení:', error);
    }
  }, [navigate]);

  const value = { user, role, authChecked, handleLogin, handleLogout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth musí být použit uvnitř AuthProvider');
  return ctx;
}
