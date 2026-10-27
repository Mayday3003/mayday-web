"use client";

import { useCallback, useEffect, useState } from "react";

type ToastMessage = { id: number; text: string; tone: "ok" | "error" };

/** Aviso corto tras cada acción. La región aria-live existe siempre para que el lector la anuncie. */
export function useToast() {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const notify = useCallback((text: string, tone: ToastMessage["tone"] = "ok") => setToast({ id: Date.now(), text, tone }), []);

  const element = (
    <div aria-live="polite" className="fixed inset-x-4 bottom-6 z-50 flex justify-center sm:inset-x-auto sm:right-6">
      {toast && (
        <p
          key={toast.id}
          className={`rounded-lg border bg-bg px-4 py-3 shadow-[3px_3px_0_var(--line)] ${toast.tone === "ok" ? "border-ok text-ok" : "border-danger text-danger"}`}
        >
          {toast.text}
        </p>
      )}
    </div>
  );

  return { notify, toast: element };
}

export type Notify = ReturnType<typeof useToast>["notify"];
