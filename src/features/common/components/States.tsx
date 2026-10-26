import type { ApiError } from "../domain/api";
import { Button } from "./Button";

/** Rectángulos con un pulso suave mientras llegan los datos */
export function LoadingGrid({ count = 6, label = "Cargando recuerdos…" }: { count?: number; label?: string }) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
        {Array.from({ length: count }, (_, i) => (
          <li key={i} className="bg-paper/70 p-3 pb-4 shadow-[3px_3px_0_var(--line)]">
            <div className="aspect-[4/3] animate-pulse bg-surface motion-reduce:animate-none" />
            <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-surface motion-reduce:animate-none" />
            <div className="mt-2 h-5 w-3/4 animate-pulse rounded bg-surface motion-reduce:animate-none" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function EmptyState({ message, children }: { message: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-line px-6 py-14 text-center">
      <p className="font-serif text-2xl text-muted italic">{message}</p>
      {children && <div className="mt-5 flex justify-center gap-3">{children}</div>}
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: ApiError; onRetry?: () => void }) {
  const asleep = error.status === 0;
  return (
    <div role="alert" className="rounded-2xl border border-danger/40 bg-surface px-6 py-10 text-center">
      <p className="font-serif text-2xl">{asleep ? "La API está despertando" : "No se pudo cargar"}</p>
      <p className="mx-auto mt-2 max-w-[48ch] text-muted">
        {asleep ? "El servidor gratuito se duerme cuando nadie lo usa. Intenta en unos segundos." : error.message}
      </p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="mt-5">
          Reintentar
        </Button>
      )}
    </div>
  );
}
