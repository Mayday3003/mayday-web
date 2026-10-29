"use client";

import { useEffect } from "react";

/** Lleva el foco al primer campo con error, después de que React pinte los mensajes */
export function focusFirstError(form: HTMLFormElement) {
  setTimeout(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
}

/**
 * Mientras haya cambios sin guardar, el navegador pregunta antes de cerrar o recargar la pestaña.
 * El formulario además lleva data-dirty para que Modal pregunte antes de cerrarse.
 */
export function useUnsavedChanges(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
}
