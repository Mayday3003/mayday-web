"use client";

import { useQuery } from "@/src/features/common/hooks/useQuery";
import type { CreateMemoryRequest, RequestStatus } from "../domain/memory-request";
import { requestsService } from "../services/requests.service";

export function useMyRequests() {
  return useQuery("requests:mine", () => requestsService.mine());
}

export function useCreateRequest() {
  return (data: CreateMemoryRequest) => requestsService.create(data);
}

export function useAllRequests(status?: RequestStatus) {
  return useQuery(`requests:all:${status ?? ""}`, () => requestsService.all(status));
}
