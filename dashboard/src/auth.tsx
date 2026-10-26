import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { cmsPath, request } from "./api";

type User = { id: string; email: string; name: string; role: string };

type AuthCtx = {
  user: User | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("ne_token");
    if (!token) {
      setReady(true);
      return;
    }
    request<User>("/api/auth/me")
      .then(setUser)
      .catch(() => localStorage.removeItem("ne_token"))
      .finally(() => setReady(true));
  }, []);

  async function login(email: string, password: string) {
    const res = await request<{ token: string; user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("ne_token", res.token);
    setUser(res.user);
  }

  function logout() {
    localStorage.removeItem("ne_token");
    setUser(null);
    window.location.href = cmsPath("login");
  }

  return <Ctx.Provider value={{ user, ready, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("AuthProvider missing");
  return ctx;
}
