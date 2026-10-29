import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('access'));

  useEffect(() => {
    const handler = () => setIsAuth(!!localStorage.getItem('access'));
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const login = (access) => {
    localStorage.setItem('access', access);
    setIsAuth(true);
  };

  const logout = () => {
    localStorage.removeItem('access');
    setIsAuth(false);
  };

  return { isAuth, login, logout };
}