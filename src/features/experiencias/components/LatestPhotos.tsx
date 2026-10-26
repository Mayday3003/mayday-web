"use client";

import { EmptyState, ErrorState, LoadingGrid } from "@/src/features/common/components/States";
import { useExperiences } from "../hooks/useExperiences";
import { ExperienceCard } from "./ExperienceCard";

/** Los recuerdos más recientes del muro, para el inicio */
export function LatestPhotos({ count = 6 }: { count?: number }) {
  const { data, error, loading, retry } = useExperiences({ limit: count });

  if (loading) return <LoadingGrid count={3} label="Cargando las últimas fotos…" />;
  if (error) return <ErrorState error={error} onRetry={retry} />;
  if (!data || data.data.length === 0) return <EmptyState message="Aquí todavía no hay recuerdos." />;

  return (
    <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {data.data.map((experience) => (
        <li key={experience.id}>
          <ExperienceCard experience={experience} />
        </li>
      ))}
    </ul>
  );
}
