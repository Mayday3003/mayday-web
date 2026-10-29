"use client";

import { useState } from "react";
import { useQueryParams } from "@/src/features/common/hooks/useQueryParams";
import { EXPERIENCE_TYPE_LABEL, type ExperienceType } from "../domain/experience";
import { useExperienceMeta } from "../hooks/useExperiences";

const TYPES = Object.keys(EXPERIENCE_TYPE_LABEL) as ExperienceType[];
const field = "border-b border-line bg-transparent py-1.5 outline-none focus:border-accent";

export function ExperienceFilters() {
  const params = useQueryParams();
  const meta = useExperienceMeta();
  const activeType = params.get("type");
  const [search, setSearch] = useState(params.get("search") ?? "");
  const extraActive = Boolean(params.get("participant") || params.get("from") || params.get("to"));
  // Abierto si hay filtros extra al llegar; después lo maneja quien lo abre o cierra
  const [moreOpen, setMoreOpen] = useState(extraActive);

  function tab(active: boolean) {
    return active
      ? "text-text underline decoration-accent decoration-2 underline-offset-[6px]"
      : "text-muted hover:text-text";
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <div className="flex flex-wrap gap-x-5 gap-y-2 font-serif text-lg" role="group" aria-label="Tipo de recuerdo">
          <button type="button" aria-pressed={!activeType} onClick={() => params.set({ type: undefined })} className={tab(!activeType)}>
            Todos
          </button>
          {TYPES.map((type) => (
            <button
              key={type}
              type="button"
              aria-pressed={activeType === type}
              onClick={() => params.set({ type })}
              className={`capitalize ${tab(activeType === type)}`}
            >
              {EXPERIENCE_TYPE_LABEL[type]}
            </button>
          ))}
        </div>

        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            params.set({ search: search.trim() || undefined });
          }}
          className="flex w-full gap-3 sm:w-80"
        >
          <label htmlFor="buscar" className="sr-only">
            Buscar recuerdos
          </label>
          <input
            id="buscar"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar recuerdos…"
            maxLength={100}
            className={`${field} min-w-0 flex-1`}
          />
          <button type="submit" className="shrink-0 text-muted underline underline-offset-[3px] hover:text-accent">
            Buscar
          </button>
        </form>
      </div>

      <details open={moreOpen} onToggle={(e) => setMoreOpen(e.currentTarget.open)} className="group text-sm">
        <summary className="cursor-pointer list-none text-muted hover:text-text">
          <span className="group-open:hidden">+ Más filtros</span>
          <span className="hidden group-open:inline">− Menos filtros</span>
        </summary>
        <div className="mt-4 flex flex-wrap items-end gap-x-8 gap-y-4">
          <label className="flex flex-col gap-1">
            <span className="text-muted">Persona</span>
            <select
              value={params.get("participant") ?? ""}
              onChange={(e) => params.set({ participant: e.target.value || undefined })}
              disabled={!meta.data}
              className={field}
            >
              <option value="">Cualquiera</option>
              {meta.data?.participants.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-muted">Desde</span>
            <input
              type="date"
              value={params.get("from") ?? ""}
              onChange={(e) => params.set({ from: e.target.value || undefined })}
              className={field}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-muted">Hasta</span>
            <input
              type="date"
              value={params.get("to") ?? ""}
              onChange={(e) => params.set({ to: e.target.value || undefined })}
              className={field}
            />
          </label>
          {params.hasAny && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                params.clear();
              }}
              className="pb-2 text-muted underline underline-offset-[3px] hover:text-accent"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </details>
    </div>
  );
}
