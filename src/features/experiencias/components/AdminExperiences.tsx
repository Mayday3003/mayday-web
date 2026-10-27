"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/src/features/common/components/Button";
import { ConfirmDialog } from "@/src/features/common/components/ConfirmDialog";
import { Modal } from "@/src/features/common/components/Modal";
import { Pagination } from "@/src/features/common/components/Pagination";
import { EmptyState, ErrorState } from "@/src/features/common/components/States";
import type { Notify } from "@/src/features/common/components/Toast";
import { ApiError } from "@/src/features/common/domain/api";
import { EXPERIENCE_TYPE_LABEL, formatDate, type Experience } from "../domain/experience";
import { useExperiences } from "../hooks/useExperiences";
import { experiencesService } from "../services/experiences.service";
import { ExperienceForm } from "./ExperienceForm";

type Editing = { mode: "create" } | { mode: "edit"; experience: Experience } | null;

export function AdminExperiences({ notify }: { notify: Notify }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const { data, error, loading, retry } = useExperiences({ page, limit: 10, search: query });
  const [editing, setEditing] = useState<Editing>(null);
  const [toDelete, setToDelete] = useState<Experience | null>(null);
  const [deleting, setDeleting] = useState(false);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setQuery(search.trim());
  }

  function onSaved(experience: Experience, warning?: string) {
    const created = editing?.mode === "create";
    setEditing(null);
    if (warning) notify(warning, "error");
    else notify(created ? `“${experience.title}” quedó en el muro.` : "Cambios guardados.");
    retry();
  }

  async function onDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await experiencesService.remove(toDelete.id);
      notify(`Se eliminó “${toDelete.title}”.`);
      // Si era el último de la página, se vuelve a la anterior
      if (data?.data.length === 1 && page > 1) setPage(page - 1);
      else retry();
    } catch (err) {
      notify(err instanceof ApiError ? err.message : "No se pudo eliminar.", "error");
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  }

  return (
    <section aria-labelledby="admin-experiencias">
      <h2 id="admin-experiencias" className="sr-only">
        Experiencias
      </h2>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <form onSubmit={onSearch} role="search" className="flex min-w-0 flex-1 gap-2 sm:max-w-sm">
          <label htmlFor="admin-buscar" className="sr-only">
            Buscar recuerdos
          </label>
          <input
            id="admin-buscar"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título…"
            className="min-w-0 flex-1 rounded-lg border border-line bg-bg px-3 py-2 outline-none focus:border-accent"
          />
          <Button type="submit" variant="secondary">
            Buscar
          </Button>
        </form>
        <Button onClick={() => setEditing({ mode: "create" })}>+ Nuevo recuerdo</Button>
      </div>

      {loading ? (
        <div role="status" className="space-y-3">
          <span className="sr-only">Cargando recuerdos…</span>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-surface motion-reduce:animate-none" />
          ))}
        </div>
      ) : error ? (
        <ErrorState error={error} onRetry={retry} />
      ) : !data?.data.length ? (
        <EmptyState message={query ? `Nada coincide con “${query}”.` : "El muro está vacío."} />
      ) : (
        <>
          <ul className="divide-y divide-line border-y border-line">
            {data.data.map((exp) => (
              <li key={exp.id} className="flex flex-wrap items-center gap-4 py-3">
                <div className="w-16 shrink-0 bg-paper p-1 shadow-[2px_2px_0_var(--line)]">
                  {exp.imageUrl ? (
                    // Miniatura de 64px: no vale la pena pasar por next/image
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={exp.imageUrl} alt="" className="aspect-square w-full object-cover" />
                  ) : (
                    <div className="aspect-square bg-surface" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/muro/${exp.id}`} className="font-serif text-xl hover:text-accent hover:underline">
                    {exp.title}
                  </Link>
                  <p className="font-mono text-xs text-muted">
                    {EXPERIENCE_TYPE_LABEL[exp.type]}
                    {exp.date && ` · ${formatDate(exp.date)}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setEditing({ mode: "edit", experience: exp })} aria-label={`Editar ${exp.title}`}>
                    Editar
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setToDelete(exp)}
                    aria-label={`Eliminar ${exp.title}`}
                    className="hover:!border-danger hover:!text-danger"
                  >
                    Eliminar
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Pagination page={page} totalPages={data.pagination.totalPages} onChange={setPage} />
          </div>
        </>
      )}

      <Modal open={editing !== null} title={editing?.mode === "edit" ? "Editar recuerdo" : "Nuevo recuerdo"} onClose={() => setEditing(null)}>
        <ExperienceForm
          key={editing?.mode === "edit" ? editing.experience.id : "new"}
          experience={editing?.mode === "edit" ? editing.experience : undefined}
          onSaved={onSaved}
          onCancel={() => setEditing(null)}
        />
      </Modal>

      <ConfirmDialog
        open={toDelete !== null}
        title="¿Eliminar recuerdo?"
        message={`¿Eliminar “${toDelete?.title ?? ""}”? También se borran su foto y sus comentarios. Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        loading={deleting}
        onConfirm={onDelete}
        onCancel={() => setToDelete(null)}
      />
    </section>
  );
}
