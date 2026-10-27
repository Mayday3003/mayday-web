import { http } from "@/src/features/common/http";
import type { Paginated } from "@/src/features/common/domain/api";
import type { Experience, ExperienceDetail, ExperienceFilters, ExperienceInput, ExperienceMeta } from "../domain/experience";

function toQuery(filters: ExperienceFilters) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") params.set(key, String(value));
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

export const experiencesService = {
  list: (filters: ExperienceFilters = {}) => http.get<Paginated<Experience>>(`/api/experiencias${toQuery(filters)}`),
  getMeta: () => http.get<ExperienceMeta>("/api/experiencias/meta"),
  getById: (id: string) => http.get<ExperienceDetail>(`/api/experiencias/${encodeURIComponent(id)}`),
  // Solo admin
  create: (data: ExperienceInput) => http.post<Experience>("/api/experiencias", data),
  update: (id: string, data: ExperienceInput) => http.put<Experience>(`/api/experiencias/${encodeURIComponent(id)}`, data),
  remove: (id: string) => http.delete(`/api/experiencias/${encodeURIComponent(id)}`),
  uploadImage: (id: string, file: File) => {
    const form = new FormData();
    form.append("image", file);
    return http.upload<Experience>(`/api/experiencias/${encodeURIComponent(id)}/imagen`, form);
  },
};
