import type { User } from "@/src/features/auth/domain/auth";

// El token vive en una cookie (la lee http.ts y también proxy.ts en el servidor).
// El usuario va en localStorage solo para pintar la navbar sin esperar a la red.
export const TOKEN_COOKIE = "mayday_token";
const USER_KEY = "mayday_user";
const ONE_DAY = 60 * 60 * 24;

export type SessionSnapshot =
  | { status: "loading"; user: null }
  | { status: "guest"; user: null }
  | { status: "authenticated"; user: User };

const LOADING: SessionSnapshot = { status: "loading", user: null };
const GUEST: SessionSnapshot = { status: "guest", user: null };

export function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function readUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

// --- Store mínimo para useSyncExternalStore ---
const listeners = new Set<() => void>();
let cached: SessionSnapshot | null = null;

function emit() {
  cached = null;
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): SessionSnapshot {
  if (cached) return cached;
  const user = getToken() ? readUser() : null;
  cached = user ? { status: "authenticated", user } : GUEST;
  return cached;
}

/** En el servidor no hay cookie ni localStorage: la sesión aún no se sabe */
export function getServerSnapshot(): SessionSnapshot {
  return LOADING;
}

export function saveSession(token: string, user: User) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${ONE_DAY}; SameSite=Lax${secure}`;
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // Sin localStorage la navbar se arma igual con el estado en memoria
  }
  emit();
}

export function clearSession() {
  document.cookie = `${TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
  try {
    localStorage.removeItem(USER_KEY);
  } catch {
    // Nada que borrar
  }
  emit();
}
