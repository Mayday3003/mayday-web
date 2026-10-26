import { http } from "@/src/features/common/http";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../domain/auth";

export const authService = {
  login: (data: LoginRequest) => http.post<AuthResponse>("/api/auth/login", data),
  register: (data: RegisterRequest) => http.post<AuthResponse>("/api/auth/register", data),
};
