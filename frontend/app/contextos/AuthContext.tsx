"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Usuario = {
  id: string;
  nome: string;
  email: string;
  perfil: string;
  uf: string | null;
  municipio: string | null;
};

type AuthContextType = {
  usuario: Usuario | null;
  token: string | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  registrar: (dados: any) => Promise<void>;
  sair: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("estes_token");
    const u = localStorage.getItem("estes_usuario");
    if (t && u) {
      setToken(t);
      setUsuario(JSON.parse(u));
    }
    setCarregando(false);
  }, []);

  async function entrar(email: string, senha: string) {
    const r = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });
    if (!r.ok) {
      const err = await r.json();
      throw new Error(err.detail || "Erro ao entrar");
    }
    const data = await r.json();
    localStorage.setItem("estes_token", data.access_token);
    localStorage.setItem("estes_usuario", JSON.stringify(data.usuario));
    setToken(data.access_token);
    setUsuario(data.usuario);
  }

  async function registrar(dados: any) {
    const r = await fetch(`${API}/auth/registrar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    if (!r.ok) {
      const err = await r.json();
      throw new Error(err.detail || "Erro ao registrar");
    }
    const data = await r.json();
    localStorage.setItem("estes_token", data.access_token);
    localStorage.setItem("estes_usuario", JSON.stringify(data.usuario));
    setToken(data.access_token);
    setUsuario(data.usuario);
  }

  function sair() {
    localStorage.removeItem("estes_token");
    localStorage.removeItem("estes_usuario");
    setToken(null);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider
      value={{ usuario, token, carregando, entrar, registrar, sair }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
