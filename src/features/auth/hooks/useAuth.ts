"use client";

import { useSyncExternalStore } from "react";
import {
  clearSession,
  getServerSnapshot,
  getSnapshot,
  saveSession,
  subscribe,
} from "@/src/features/common/session";
import type { LoginRequest, RegisterRequest } from "../domain/auth";
import { authService } from "../services/auth.service";

/**
 * Sesión compartida por toda la app. El estado vive en session.ts (cookie + localStorage),
 * así que no hace falta un Provider: todos los componentes leen la misma fuente.
 */
export function useAuth() {
  const session = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  async function login(data: LoginRequest) {
    const { token, user } = await authService.login(data);
    saveSession(token, user);
    return user;
  }

  async function register(data: RegisterRequest) {
    const { token, user } = await authService.register(data);
    saveSession(token, user);
    return user;
  }

  function logout() {
    clearSession();
  }

  return {
    status: session.status,
    user: session.user,
    isAdmin: session.user?.role === "admin",
    login,
    register,
    logout,
  };
}
