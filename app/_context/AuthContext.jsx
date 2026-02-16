"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getUser } from "../lib/auth/getUser";
import { GoogleOAuthProvider } from "@react-oauth/google";

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
      credentials: "include",
    });
    const data = await res.json();
    if (res.ok && data.user) {
      setUser(data.user);
      return { success: true, ...data };
    }
    return { success: false, ...data };
  };

  const googleLogin = async (credential) => {
    try {
      const res = await fetch("/api/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      });
      const data = await res.json();

      if (res.ok && data.user) {
        setUser(data.user);
        return { success: true, ...data };
      }
      return { success: false, ...data };
    } catch (error) {
      console.error("Google login error", error);
      return { success: false, message: "Google login failed" };
    }
  };

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_CLIENT_ID}>
      <AuthContext.Provider value={{ user, login, googleLogin, logout }}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}

export const useAuth = () => useContext(AuthContext);
