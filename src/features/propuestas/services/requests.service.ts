import { http } from "@/src/features/common/http";
import type { CreateMemoryRequest, MemoryRequest, RequestStatus, ReviewedMemoryRequest } from "../domain/memory-request";

export const requestsService = {
  create: (data: CreateMemoryRequest) => http.post<MemoryRequest>("/api/propuestas", data),
  mine: () => http.get<MemoryRequest[]>("/api/propuestas/mias"),
  // Solo admin
  all: (status?: RequestStatus) => http.get<ReviewedMemoryRequest[]>(`/api/propuestas${status ? `?status=${status}` : ""}`),
  approve: (id: string) => http.patch<ReviewedMemoryRequest>(`/api/propuestas/${encodeURIComponent(id)}/aprobar`),
  reject: (id: string) => http.patch<ReviewedMemoryRequest>(`/api/propuestas/${encodeURIComponent(id)}/rechazar`),
};
