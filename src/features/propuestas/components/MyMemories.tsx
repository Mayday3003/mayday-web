"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { EmptyState, ErrorState } from "@/src/features/common/components/States";
import { formatDate } from "@/src/features/experiencias/domain/experience";
import { useMyComments } from "@/src/features/interacciones/hooks/useComments";
import { useMyRequests } from "../hooks/useRequests";
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

function Requests() {
  const { data, error, loading, retry } = useMyRequests();
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
    <ul className="divide-y divide-line border-y border-line">
      {data.map((r) => (
        <li key={r.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
          <div>
            <p className="font-serif text-xl">
              {r.status === "aprobada" && r.experienceId ? (
                <Link href={`/muro/${r.experienceId}`} className="hover:text-accent hover:underline">
                  {r.title}
                </Link>
              ) : (
                r.title
              )}
            </p>
            <p className="font-mono text-xs text-muted">enviada el {formatDate(r.createdAt)}</p>
          </div>
          <StatusBadge status={r.status} />
        </li>
      ))}
    </ul>
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
              {c.experience.title}
            </Link>{" "}
            <span className="font-mono text-xs">· {formatDate(c.createdAt)}</span>
          </p>
        </li>
      ))}
    </ul>
  );
}

export function MyMemories() {
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
        {tab === "propuestas" ? <Requests /> : <Comments />}
      </div>
    </div>
  );
}
