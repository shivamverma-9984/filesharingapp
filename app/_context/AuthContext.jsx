'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { getUser } from '../lib/auth/getUser';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    const u = await getUser();
    setUser(u);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (formdata) => {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata),
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        return { success: true, ...data };
      }
      return { success: false, ...data };
  };

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
