"use client";

import Link from "next/link";
import { EmptyState, ErrorState } from "@/src/features/common/components/States";
import { formatDate } from "@/src/features/experiencias/domain/experience";
import { useAllComments } from "../hooks/useComments";

export function AdminComments() {
  const { data, error, loading, retry } = useAllComments();

  return (
    <section aria-labelledby="admin-comentarios">
      <h2 id="admin-comentarios" className="sr-only">
        Comentarios
      </h2>
      {loading ? (
        <div role="status" className="space-y-3">
          <span className="sr-only">Cargando comentarios…</span>
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-surface motion-reduce:animate-none" />
          ))}
        </div>
      ) : error ? (
        <ErrorState error={error} onRetry={retry} />
      ) : !data?.length ? (
        <EmptyState message="Nadie ha comentado todavía." />
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {data.map((c) => (
            <li key={c.id} className="py-4">
              <p className="whitespace-pre-line">{c.content}</p>
              <p className="mt-1 text-sm text-muted">
                <span className="text-text">{c.user.name}</span> en{" "}
                <Link href={`/muro/${c.experience.id}`} className="text-accent underline underline-offset-[3px]">
                  {c.experience.title}
                </Link>{" "}
                <span className="font-mono text-xs">· {formatDate(c.createdAt)}</span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
