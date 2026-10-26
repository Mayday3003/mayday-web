import { API_BASE_URL } from "./config";
import { ApiError, type FieldErrors } from "./domain/api";
import { clearSession, getToken } from "./session";

type ErrorBody = { error?: { message?: string; statusCode?: number; fields?: FieldErrors } };

// Único lugar del proyecto donde se usa fetch
async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const isForm = body instanceof FormData;
  if (body !== undefined && !isForm) headers["Content-Type"] = "application/json";

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, "No se pudo conectar con el servidor. Si la API estaba dormida, intenta en unos segundos.");
  }

  if (response.status === 204) return undefined as T;

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    // Token vencido o inválido: se cierra la sesión. El 401 del login no lleva token y no entra aquí.
    if (response.status === 401 && token) {
      clearSession();
      // Recarga completa a propósito: http.ts no vive en React y así se limpia todo el estado
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/login?expirado=1");
    }
    const error = (data as ErrorBody | null)?.error;
    throw new ApiError(response.status, error?.message ?? "Algo salió mal. Intenta de nuevo.", error?.fields);
  }

  return data as T;
}

export const http = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  delete: <T = void>(path: string) => request<T>("DELETE", path),
  upload: <T>(path: string, form: FormData) => request<T>("POST", path, form),
};
