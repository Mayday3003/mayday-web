"use client";

import { useQuery } from "@/src/features/common/hooks/useQuery";
import type { ExperienceFilters } from "../domain/experience";
import { experiencesService } from "../services/experiences.service";

export function useExperiences(filters: ExperienceFilters) {
  return useQuery(`experiences:${JSON.stringify(filters)}`, () => experiencesService.list(filters));
}

export function useExperience(id: string) {
  return useQuery(`experience:${id}`, () => experiencesService.getById(id));
}

export function useExperienceMeta() {
  return useQuery("experiences:meta", () => experiencesService.getMeta());
}
