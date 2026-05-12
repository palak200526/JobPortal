"use client";

import { createContext, useEffect, useMemo, useState } from "react";

import * as authService from "@/services/authService";
import type { User } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (payload: { email: string; password: string }) => Promise<User>;
  signup: (payload: Record<string, unknown>) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

function persistAuth(token: string, user: User) {
  window.localStorage.setItem("aurajobs-token", token);
  window.localStorage.setItem("aurajobs-user", JSON.stringify(user));
}

function clearAuth() {
  window.localStorage.removeItem("aurajobs-token");
  window.localStorage.removeItem("aurajobs-user");
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = window.localStorage.getItem("aurajobs-token");
    const storedUser = window.localStorage.getItem("aurajobs-user");

    if (!storedToken || !storedUser) {
      setIsLoading(false);
      return;
    }

    setToken(storedToken);
    setUser(JSON.parse(storedUser));

    authService
      .fetchCurrentUser()
      .then((nextUser) => {
        setUser(nextUser);
        window.localStorage.setItem("aurajobs-user", JSON.stringify(nextUser));
      })
      .catch(() => {
        clearAuth();
        setUser(null);
        setToken(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      async login(payload) {
        const result = await authService.login(payload);
        persistAuth(result.token, result.user);
        setToken(result.token);
        setUser(result.user);
        return result.user;
      },
      async signup(payload) {
        const result = await authService.signup(payload);
        persistAuth(result.token, result.user);
        setToken(result.token);
        setUser(result.user);
        return result.user;
      },
      async logout() {
        try {
          await authService.logout();
        } finally {
          clearAuth();
          setUser(null);
          setToken(null);
        }
      },
      async refreshUser() {
        if (!window.localStorage.getItem("aurajobs-token")) {
          return null;
        }

        const nextUser = await authService.fetchCurrentUser();
        setUser(nextUser);
        window.localStorage.setItem("aurajobs-user", JSON.stringify(nextUser));
        return nextUser;
      },
    }),
    [isLoading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
