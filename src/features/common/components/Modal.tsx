"use client";

import { useEffect, useId, useRef } from "react";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

/**
 * Usa <dialog> nativo con showModal(): el navegador ya atrapa el foco,
 * cierra con Esc, deja inerte el resto de la página y devuelve el foco al cerrar.
 */
export function Modal({ open, title, onClose, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      // Clic en el fondo (el propio <dialog>, fuera de la caja) también cierra
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="m-auto w-[calc(100%-2rem)] max-w-[560px] rounded-2xl border border-line bg-bg p-0 text-text shadow-[6px_6px_0_var(--line)] backdrop:bg-text/40"
    >
      <div className="max-h-[85vh] overflow-y-auto p-6 sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 id={titleId} className="font-serif text-3xl">
            {title}
          </h2>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="text-2xl leading-none text-muted hover:text-accent">
            ×
          </button>
        </div>
        {open && children}
      </div>
    </dialog>
  );
}
