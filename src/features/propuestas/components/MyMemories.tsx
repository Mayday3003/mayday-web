"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/src/features/common/components/Button";
import { ButtonLink } from "@/src/features/common/components/ButtonLink";
import { ConfirmDialog } from "@/src/features/common/components/ConfirmDialog";
import { Modal } from "@/src/features/common/components/Modal";
import { useToast, type Notify } from "@/src/features/common/components/Toast";
import { EmptyState, ErrorState } from "@/src/features/common/components/States";
import { ApiError } from "@/src/features/common/domain/api";
import { ExperienceForm } from "@/src/features/experiencias/components/ExperienceForm";
import type { ExperienceDetail } from "@/src/features/experiencias/domain/experience";
import { experiencesService } from "@/src/features/experiencias/services/experiences.service";
import { displayTitle, formatDate, quoted } from "@/src/features/experiencias/domain/experience";
import { useMyComments } from "@/src/features/interacciones/hooks/useComments";
import type { MemoryRequest } from "../domain/memory-request";
import { useMyRequests } from "../hooks/useRequests";
import { requestsService } from "../services/requests.service";
import { MemoryRequestForm } from "./MemoryRequestForm";
import { StatusBadge } from "./StatusBadge";

type Tab = "propuestas" | "comentarios";

function ListLoading() {
  return (
    <div role="status" className="space-y-3">
      <span className="sr-only">Cargando…</span>
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-16 animate-pulse rounded-lg bg-surface motion-reduce:animate-none" />
      ))}
    </div>
  );
}

function Requests({ notify }: { notify: Notify }) {
  const { data, error, loading, retry } = useMyRequests();
  const [toDelete, setToDelete] = useState<MemoryRequest | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [toEdit, setToEdit] = useState<ExperienceDetail | null>(null);
  const [loadingEdit, setLoadingEdit] = useState<string | null>(null);
  const [requestToEdit, setRequestToEdit] = useState<MemoryRequest | null>(null);

  // Pendiente: se edita la propuesta. Aprobada: ya es un recuerdo del muro y se edita esa experiencia
  async function onEdit(request: MemoryRequest) {
    if (request.status === "pendiente") return setRequestToEdit(request);
    if (!request.experienceId) return;
    setLoadingEdit(request.id);
    setDeleteError("");
    try {
      setToEdit(await experiencesService.getById(request.experienceId));
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "No se pudo abrir el recuerdo. Intenta de nuevo.");
    } finally {
      setLoadingEdit(null);
    }
  }

  // Aprobada: ya es un recuerdo del muro y se borra esa experiencia (la API borra también la propuesta)
  async function onDelete() {
    if (!toDelete) return;
    setDeleting(true);
    setDeleteError("");
    try {
      if (toDelete.status === "aprobada" && toDelete.experienceId) await experiencesService.remove(toDelete.experienceId);
      else await requestsService.remove(toDelete.id);
      retry();
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "No se pudo borrar. Intenta de nuevo.");
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  }

  if (loading) return <ListLoading />;
  if (error) return <ErrorState error={error} onRetry={retry} />;
  if (!data?.length) {
    return (
      <EmptyState message="Todavía no has propuesto recuerdos.">
        <Link href="/muro/nuevo" className="text-accent underline underline-offset-[3px]">
          Proponer uno
        </Link>
      </EmptyState>
    );
  }
  return (
    <>
      {deleteError && (
        <p role="alert" className="mb-4 rounded-lg border border-danger/40 px-3 py-2 text-sm text-danger">
          {deleteError}
        </p>
      )}
      <ul className="divide-y divide-line border-y border-line">
        {data.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div>
              <p className="font-serif text-xl">
                {r.status === "aprobada" && r.experienceId ? (
                  <Link href={`/muro/${r.experienceId}`} className="hover:text-accent hover:underline">
                    {r.title || <span className="sr-only">{displayTitle(r)}</span>}
                  </Link>
                ) : (
                  r.title || <span className="sr-only">{displayTitle(r)}</span>
                )}
              </p>
              <p className="font-mono text-xs text-muted">enviada el {formatDate(r.createdAt)}</p>
            </div>
            <div className="flex items-center gap-4">
              <StatusBadge status={r.status} />
              {(r.status === "pendiente" || (r.status === "aprobada" && r.experienceId)) && (
                <Button
                  variant="secondary"
                  onClick={() => onEdit(r)}
                  loading={loadingEdit === r.id}
                  aria-label={`Editar ${displayTitle(r)}`}
                  className="!px-3 !py-1 text-sm"
                >
                  Editar
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={() => setToDelete(r)}
                aria-label={`Borrar ${displayTitle(r)}`}
                className="!px-3 !py-1 text-sm hover:!border-danger hover:!text-danger"
              >
                Borrar
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <Modal open={toEdit !== null} title="Editar recuerdo" onClose={() => setToEdit(null)}>
        {toEdit && (
          <ExperienceForm
            key={toEdit.id}
            experience={toEdit}
            onSaved={(_, warning) => {
              setToEdit(null);
              notify(warning ?? "Cambios guardados.", warning ? "error" : "ok");
              retry();
            }}
            onCancel={() => setToEdit(null)}
          />
        )}
      </Modal>
      <Modal open={requestToEdit !== null} title="Editar propuesta" onClose={() => setRequestToEdit(null)}>
        {requestToEdit && (
          <MemoryRequestForm
            key={requestToEdit.id}
            request={requestToEdit}
            onSaved={(photoFailed) => {
              setRequestToEdit(null);
              notify(photoFailed ? "Se guardaron los cambios, pero la foto no se pudo subir." : "Cambios guardados.", photoFailed ? "error" : "ok");
              retry();
            }}
            onCancel={() => setRequestToEdit(null)}
          />
        )}
      </Modal>
      <ConfirmDialog
        open={toDelete !== null}
        title="¿Borrar este recuerdo?"
        message={
          toDelete?.status === "aprobada"
            ? `${quoted(toDelete, "Este recuerdo")} ya está en el muro. Se borrará del muro junto con su foto y sus comentarios. Esta acción no se puede deshacer.`
            : `¿Borrar ${toDelete?.title ? `la propuesta “${toDelete.title}”` : "esta propuesta"}? Esta acción no se puede deshacer.`
        }
        confirmLabel="Borrar"
        loading={deleting}
        onConfirm={onDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}

function Comments() {
  const { data, error, loading, retry } = useMyComments();
  if (loading) return <ListLoading />;
  if (error) return <ErrorState error={error} onRetry={retry} />;
  if (!data?.length) return <EmptyState message="Todavía no has comentado ningún recuerdo." />;
  return (
    <ul className="divide-y divide-line border-y border-line">
      {data.map((c) => (
        <li key={c.id} className="py-4">
          <p className="whitespace-pre-line">{c.content}</p>
          <p className="mt-1 text-sm text-muted">
            en{" "}
            <Link href={`/muro/${c.experience.id}`} className="text-accent underline underline-offset-[3px]">
              {c.experience.title || "un recuerdo"}
            </Link>{" "}
            <span className="font-mono text-xs">· {formatDate(c.createdAt)}</span>
          </p>
        </li>
      ))}
    </ul>
  );
}

export function MyMemories() {
  // Vive aquí y no en la lista: al guardar, la lista se recarga y el aviso debe seguir visible
  const { notify, toast } = useToast();
  const [tab, setTab] = useState<Tab>("propuestas");
  const params = useSearchParams();
  const sent = params.get("enviado");
  const photoFailed = params.get("foto") === "fallo";

  return (
    <div>
      {sent && (
        <p role="status" className="mb-8 rounded-lg border border-ok/50 px-4 py-3 text-ok">
          Tu recuerdo quedó pendiente de aprobación.
        </p>
      )}
      {sent && photoFailed && (
        <p role="alert" className="mb-8 rounded-lg border border-danger/40 px-4 py-3 text-danger">
          La foto no se pudo subir, pero el recuerdo sí se envió sin ella.
        </p>
      )}
      <div className="mb-8">
        <ButtonLink href="/muro/nuevo">{sent ? "Agregar otro recuerdo" : "Agregar recuerdo"}</ButtonLink>
      </div>
      <div role="tablist" className="flex gap-6 border-b border-line font-serif text-lg">
        {(["propuestas", "comentarios"] as Tab[]).map((t) => (
          <button
            key={t}
            role="tab"
            type="button"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 pb-2 capitalize ${tab === t ? "border-accent text-text" : "border-transparent text-muted hover:text-text"}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="mt-8">
        {tab === "propuestas" ? <Requests notify={notify} /> : <Comments />}
      </div>
      {toast}
    </div>
  );
}
