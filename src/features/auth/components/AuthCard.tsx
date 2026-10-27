/** Hoja de papel centrada donde van los formularios de sesión */
export function AuthCard({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[440px] px-4 py-16">
      <div className="rounded-2xl border border-line bg-surface p-6 shadow-[4px_4px_0_var(--line)] sm:p-8">
        <h1 className="font-serif text-[28px] font-medium">{title}</h1>
        {note && <p className="mt-1 text-muted">{note}</p>}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
