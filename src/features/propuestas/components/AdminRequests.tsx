"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/src/features/common/components/Button";
import { EmptyState, ErrorState } from "@/src/features/common/components/States";
import type { Notify } from "@/src/features/common/components/Toast";
import { ApiError } from "@/src/features/common/domain/api";
import { EXPERIENCE_TYPE_LABEL, formatDate } from "@/src/features/experiencias/domain/experience";
import type { RequestStatus, ReviewedMemoryRequest } from "../domain/memory-request";
import { useAllRequests } from "../hooks/useRequests";
import { requestsService } from "../services/requests.service";
import { StatusBadge } from "./StatusBadge";

const FILTERS: { value: RequestStatus | undefined; label: string }[] = [
  { value: "pendiente", label: "Pendientes" },
  { value: "aprobada", label: "Aprobadas" },
  { value: "rechazada", label: "Rechazadas" },
  { value: undefined, label: "Todas" },
];

export function AdminRequests({ notify }: { notify: Notify }) {
  const [status, setStatus] = useState<RequestStatus | undefined>("pendiente");
  const { data, error, loading, retry } = useAllRequests(status);
  const [busy, setBusy] = useState<string | null>(null);

  async function review(request: ReviewedMemoryRequest, action: "approve" | "reject") {
    setBusy(request.id);
    try {
      await requestsService[action](request.id);
      notify(action === "approve" ? `“${request.title}” ya está en el muro.` : `Se rechazó “${request.title}”.`);
    } catch (err) {
      // 409: otra pestaña (u otro admin) ya la revisó
      if (err instanceof ApiError && err.status === 409) notify(`${err.message}. Actualicé la lista.`, "error");
      else notify(err instanceof ApiError ? err.message : "No se pudo revisar.", "error");
    } finally {
      setBusy(null);
      retry();
    }
  }

  return (
    <section aria-labelledby="admin-propuestas">
      <h2 id="admin-propuestas" className="sr-only">
        Propuestas
      </h2>
      <div role="group" aria-label="Filtrar por estado" className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            type="button"
            aria-pressed={status === f.value}
            onClick={() => setStatus(f.value)}
            className={`rounded-full border px-3 py-1 text-sm ${status === f.value ? "border-accent bg-accent text-bg" : "border-line hover:border-accent"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div role="status" className="space-y-3">
          <span className="sr-only">Cargando propuestas…</span>
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-lg bg-surface motion-reduce:animate-none" />
          ))}
        </div>
      ) : error ? (
        <ErrorState error={error} onRetry={retry} />
      ) : !data?.length ? (
        <EmptyState message={status === "pendiente" ? "No hay propuestas por revisar." : "No hay propuestas aquí."} />
      ) : (
        <ul className="space-y-4">
          {data.map((r) => (
            <li key={r.id} className="rounded-xl border border-line p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-serif text-2xl">
                    {r.status === "aprobada" && r.experienceId ? (
                      <Link href={`/muro/${r.experienceId}`} className="hover:text-accent hover:underline">
                        {r.title}
                      </Link>
                    ) : (
                      r.title
                    )}
                  </p>
                  <p className="font-mono text-xs text-muted">
                    {EXPERIENCE_TYPE_LABEL[r.type]}
                    {r.date && ` · ${formatDate(r.date)}`} · de {r.user.name} ({r.user.email}) · {formatDate(r.createdAt)}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <p className="mt-3 whitespace-pre-line">{r.description}</p>
              {r.participants.length > 0 && <p className="mt-2 text-sm text-muted">Con: {r.participants.join(", ")}</p>}
              {r.imageUrl && (
                <a href={r.imageUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-accent underline underline-offset-[3px]">
                  Ver imagen propuesta
                </a>
              )}
              {r.status === "pendiente" && (
                <div className="mt-4 flex gap-2 border-t border-line pt-4">
                  <Button onClick={() => review(r, "approve")} loading={busy === r.id}>
                    Aprobar
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => review(r, "reject")}
                    disabled={busy === r.id}
                    className="hover:!border-danger hover:!text-danger"
                  >
                    Rechazar
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
