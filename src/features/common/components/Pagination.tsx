type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

/** Con muchas páginas se ven la primera, la última y las vecinas de la actual: 1 … 4 5 6 … 20 */
function visiblePages(page: number, totalPages: number) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  return [...new Set([1, page - 1, page, page + 1, totalPages])].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
}

/** ← anterior · 1 2 3 · siguiente → */
export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = visiblePages(page, totalPages);
  const arrow = "text-muted hover:text-accent disabled:pointer-events-none disabled:opacity-40";

  return (
    <nav aria-label="Paginación" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-serif text-lg">
      <button type="button" className={arrow} disabled={page <= 1} onClick={() => onChange(page - 1)}>
        ← anterior
      </button>
      <span aria-hidden className="text-line">·</span>
      <ul className="flex gap-1">
        {pages.map((n, i) => (
          <li key={n} className="flex items-center gap-1">
            {i > 0 && n - pages[i - 1] > 1 && (
              <span aria-hidden className="px-1 text-muted">
                …
              </span>
            )}
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
