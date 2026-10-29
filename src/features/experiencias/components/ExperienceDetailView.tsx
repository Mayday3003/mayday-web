"use client";

import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { Button } from "@/src/features/common/components/Button";
import { ConfirmDialog } from "@/src/features/common/components/ConfirmDialog";
import { Modal } from "@/src/features/common/components/Modal";
import { ErrorState } from "@/src/features/common/components/States";
import { ApiError } from "@/src/features/common/domain/api";
import { CommentForm } from "@/src/features/interacciones/components/CommentForm";
import { EXPERIENCE_TYPE_LABEL, formatDate } from "../domain/experience";
import { useExperience } from "../hooks/useExperiences";
import { experiencesService } from "../services/experiences.service";
import { ExperienceForm } from "./ExperienceForm";
import { ExperiencePhoto } from "./ExperiencePhoto";

export function ExperienceDetailView({ id }: { id: string }) {
  const { data, error, loading, retry } = useExperience(id);
  const { status, user, isAdmin } = useAuth();
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saveWarning, setSaveWarning] = useState("");

  async function onDelete() {
    setDeleting(true);
    setDeleteError("");
    try {
      await experiencesService.remove(id);
      router.replace("/muro");
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "No se pudo borrar. Intenta de nuevo.");
      setDeleting(false);
      setConfirming(false);
    }
  }

  if (loading) {
    return (
      <div role="status" className="space-y-4">
        <span className="sr-only">Cargando recuerdo…</span>
        <div className="aspect-[4/3] animate-pulse bg-surface motion-reduce:animate-none" />
        <div className="h-8 w-2/3 animate-pulse rounded bg-surface motion-reduce:animate-none" />
      </div>
    );
  }
  // Un id inválido (400) o inexistente (404) se muestra como la página 404
  if (error && (error.status === 400 || error.status === 404)) notFound();
  if (error || !data) return <ErrorState error={error!} onRetry={retry} />;

  const date = formatDate(data.date);
  // Solo es una ayuda visual: la API vuelve a revisar el permiso y responde 403 si no corresponde
  const canManage = isAdmin || (!!user && user.id === data.authorId);

  return (
    <article>
      <figure className="-rotate-[0.6deg] bg-paper p-3 pb-4 shadow-[4px_4px_0_var(--line)] sm:p-4">
        <div className="relative aspect-[4/3]">
          <ExperiencePhoto src={data.imageUrl} alt={data.title} sizes="(min-width: 768px) 720px, 100vw" priority />
        </div>
      </figure>

      <header className="mt-10">
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted">
          <span>{EXPERIENCE_TYPE_LABEL[data.type]}</span>
          {date && <time dateTime={data.date ?? undefined}>— {date}</time>}
        </div>
        <h1 className="mt-3 font-serif text-[40px] leading-tight font-medium">{data.title}</h1>
        {data.participants.length > 0 && (
          <p className="mt-2 text-muted">Con {data.participants.join(", ")}</p>
        )}
      </header>

      <p className="mt-6 max-w-[65ch] text-lg whitespace-pre-line">{data.description}</p>

      {canManage && (
        <div className="mt-8">
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => setEditing(true)}>
              Editar recuerdo
            </Button>
            <Button variant="secondary" onClick={() => setConfirming(true)} className="hover:!border-danger hover:!text-danger">
              Borrar recuerdo
            </Button>
          </div>
          {(deleteError || saveWarning) && (
            <p role="alert" className="mt-3 text-sm text-danger">
              {deleteError || saveWarning}
            </p>
          )}
          <Modal open={editing} title="Editar recuerdo" onClose={() => setEditing(false)}>
            <ExperienceForm
              key={data.updatedAt}
              experience={data}
              onSaved={(_, warning) => {
                setEditing(false);
                setSaveWarning(warning ?? "");
                retry();
              }}
              onCancel={() => setEditing(false)}
            />
          </Modal>
          <ConfirmDialog
            open={confirming}
            title="¿Borrar este recuerdo?"
            message={`¿Borrar “${data.title}”? También se borran su foto y sus comentarios. Esta acción no se puede deshacer.`}
            confirmLabel="Borrar"
            loading={deleting}
            onConfirm={onDelete}
            onCancel={() => setConfirming(false)}
          />
        </div>
      )}

      <section className="mt-14 border-t border-line pt-10" aria-labelledby="comentarios">
        <h2 id="comentarios" className="font-serif text-[28px] font-medium">
          Comentarios <span className="font-mono text-sm text-muted">{data.interactions.length}</span>
        </h2>

        {data.interactions.length === 0 ? (
          <p className="mt-4 text-muted">Todavía no hay comentarios.</p>
        ) : (
          <ul className="mt-6 space-y-6">
            {data.interactions.map((comment) => (
              <li key={comment.id} className="border-l-2 border-line pl-4">
                <p className="text-sm">
                  <span className="font-medium">{comment.user.name}</span>{" "}
                  <span className="font-mono text-xs text-muted">{formatDate(comment.createdAt)}</span>
                </p>
                <p className="mt-1 whitespace-pre-line">{comment.content}</p>
              </li>
            ))}
          </ul>
        )}

        {status === "authenticated" && <CommentForm experienceId={data.id} onCreated={retry} />}

        {status === "guest" && (
          <p className="mt-8 text-muted">
            <Link href={`/login?next=/muro/${data.id}`} className="text-accent underline underline-offset-[3px]">
              Ingresa
            </Link>{" "}
            para comentar.
          </p>
        )}
      </section>
    </article>
  );
}
