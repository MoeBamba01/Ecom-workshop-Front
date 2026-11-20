"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // user = { _id, name, email, isAdmin, token } renvoyé par le back
  const [user, setUser] = useState(null);
  // ready = on a fini de relire localStorage (évite de rediriger trop tôt)
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
    setReady(true);
  }, []);

  function saveUser(data) {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  }

  async function login(email, password) {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    saveUser(data);
    return data;
  }

  async function register(name, email, password) {
    const data = await apiFetch("/auth/register", {
      method: "POST",
      body: { name, email, password },
    });
    saveUser(data);
    return data;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
