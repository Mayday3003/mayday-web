"use client";

import { useEffect } from "react";
import { Button } from "@/src/features/common/components/Button";
import { Pagination } from "@/src/features/common/components/Pagination";
import { EmptyState, ErrorState, LoadingGrid } from "@/src/features/common/components/States";
import { useQueryParams } from "@/src/features/common/hooks/useQueryParams";
import type { ExperienceFilters, ExperienceType } from "../domain/experience";
import { useExperiences } from "../hooks/useExperiences";
import { ExperienceCard } from "./ExperienceCard";

const PAGE_SIZE = 9;
export const WALL_QUERY_KEY = "muro:query";

/** Grilla del muro: lee los filtros de la URL y pide esa página a la API */
export function ExperienceWall() {
  const params = useQueryParams();
  const page = Math.max(1, Number(params.get("page")) || 1);
  const filters: ExperienceFilters = {
    page,
    limit: PAGE_SIZE,
    search: params.get("search"),
    type: params.get("type") as ExperienceType | undefined,
    participant: params.get("participant"),
    from: params.get("from"),
    to: params.get("to"),
  };
  const { data, error, loading, retry } = useExperiences(filters);
  const query = params.toString();

  // El detalle usa esto para volver al muro con los mismos filtros y la misma página
  useEffect(() => {
    try {
      sessionStorage.setItem(WALL_QUERY_KEY, query);
    } catch {
      // Sin almacenamiento, "volver" lleva al muro sin filtros
    }
  }, [query]);

  if (loading) return <LoadingGrid count={PAGE_SIZE} />;
  if (error) return <ErrorState error={error} onRetry={retry} />;
  // Una ?page= más allá de la última (por ejemplo después de borrar recuerdos)
  if (data && data.data.length === 0 && data.pagination.total > 0) {
    return (
      <EmptyState message="Esa página ya no existe.">
        <Button variant="secondary" onClick={() => params.set({ page: undefined })}>
          Ir a la primera página
        </Button>
      </EmptyState>
    );
  }
  if (!data || data.data.length === 0) {
    return (
      <EmptyState message={params.hasAny ? "Nada coincide con esos filtros." : "Aquí todavía no hay recuerdos."}>
        {params.hasAny && (
          <Button variant="secondary" onClick={params.clear}>
            Limpiar filtros
          </Button>
        )}
      </EmptyState>
    );
  }

  const { pagination } = data;
  return (
    <div className="space-y-14">
      <p className="font-mono text-xs text-muted">
        {pagination.total} {pagination.total === 1 ? "recuerdo" : "recuerdos"}
      </p>
      <ul className="-mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {data.data.map((experience) => (
          <li key={experience.id}>
            <ExperienceCard experience={experience} />
          </li>
        ))}
      </ul>
      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onChange={(n) => {
          params.set({ page: n });
          window.scrollTo({ top: 0 });
        }}
      />
    </div>
  );
}
