"use client";

import { useQuery } from "@/src/features/common/hooks/useQuery";
import type { CreateMemoryRequest, RequestStatus } from "../domain/memory-request";
import { requestsService } from "../services/requests.service";

export function useMyRequests() {
  return useQuery("requests:mine", () => requestsService.mine());
}

/**
 * Crea la propuesta y, si hay archivo, sube la foto en una segunda petición (necesita el id).
 * Si solo falla la foto, la propuesta ya quedó creada: se avisa con `imageFailed`.
 */
export function useCreateRequest() {
  return async (data: CreateMemoryRequest, file: File | null) => {
    const created = await requestsService.create(data);
    if (!file) return { request: created, imageFailed: false };
    try {
      return { request: await requestsService.uploadImage(created.id, file), imageFailed: false };
    } catch {
      return { request: created, imageFailed: true };
    }
  };
}

export function useAllRequests(status?: RequestStatus) {
  return useQuery(`requests:all:${status ?? ""}`, () => requestsService.all(status));
}
