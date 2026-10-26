type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

/** ← anterior · 1 2 3 · siguiente → */
export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const arrow = "text-muted hover:text-accent disabled:pointer-events-none disabled:opacity-40";

  return (
    <nav aria-label="Paginación" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-serif text-lg">
      <button type="button" className={arrow} disabled={page <= 1} onClick={() => onChange(page - 1)}>
        ← anterior
      </button>
      <span aria-hidden className="text-line">·</span>
      <ul className="flex gap-1">
        {pages.map((n) => (
          <li key={n}>
            <button
              type="button"
              onClick={() => onChange(n)}
              aria-current={n === page ? "page" : undefined}
              className={`size-9 rounded-full ${n === page ? "bg-accent text-bg" : "hover:bg-surface"}`}
            >
              {n}
            </button>
          </li>
        ))}
      </ul>
      <span aria-hidden className="text-line">·</span>
      <button type="button" className={arrow} disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        siguiente →
      </button>
    </nav>
  );
}
