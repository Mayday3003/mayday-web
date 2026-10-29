"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";

const linkClass = "underline-offset-[4px] hover:text-accent hover:underline";
const itemClass = "flex w-full items-center gap-2 px-4 py-2.5 text-left hover:bg-surface hover:text-accent";

/** Menú del perfil arriba a la derecha: lo de la cuenta (mis recuerditos, admin y salir) en un solo lugar */
function ProfileMenu({ name, isAdmin, onLogout }: { name: string; isAdmin: boolean; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  // Se cierra al elegir una opción, con clic afuera y con Esc (el foco vuelve al botón)
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
        className="-my-2 flex min-h-11 items-center gap-1 hover:text-text"
      >
        <span className="max-w-[12ch] truncate font-hand text-lg leading-none">hola, {name}</span>
        <svg viewBox="0 0 24 24" aria-hidden className={`size-3.5 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div
          id={menuId}
          className="absolute top-full right-0 z-40 mt-2 min-w-48 overflow-hidden rounded-lg border border-line bg-bg py-1 text-sm text-text shadow-[3px_3px_0_var(--line)]"
        >
          <Link href="/mis-recuerdos" onClick={() => setOpen(false)} className={itemClass}>
            Mis recuerditos
          </Link>
          {isAdmin && (
            <Link href="/admin" onClick={() => setOpen(false)} className={itemClass}>
              Administración
            </Link>
          )}
          <div className="my-1 border-t border-line" />
          <button type="button" onClick={onLogout} className={`${itemClass} hover:!text-danger`}>
            {/* Puerta con flecha hacia afuera */}
            <svg viewBox="0 0 24 24" aria-hidden className="size-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Franja superior de la navbar con todo lo de la cuenta, a la derecha como es costumbre.
 * `children` es lo que siempre va al final (el cambio de tema).
 */
export function SessionNav({ children }: { children: React.ReactNode }) {
  const { status, user, isAdmin, logout } = useAuth();
  const router = useRouter();

  let account: React.ReactNode = null;
  if (status === "authenticated" && user) {
    account = (
      <ProfileMenu
        name={user.name.split(" ")[0]}
        isAdmin={isAdmin}
        onLogout={() => {
          logout();
          router.push("/");
        }}
      />
    );
  } else if (status === "guest") {
    account = (
      <>
        <Link href="/login" className={linkClass}>
          Ingresar
        </Link>
        <Link href="/registro" className={linkClass}>
          Crear cuenta
        </Link>
      </>
    );
  }
  // Mientras se lee la sesión ("loading") solo se ve el cambio de tema; la franja mide lo mismo

  return (
    <div className="mx-auto flex min-h-10 max-w-[1080px] items-center justify-end gap-4 px-4 text-[13px] text-muted sm:gap-5 sm:px-6">
      {account}
      {account && <span aria-hidden className="h-3 w-px bg-line" />}
      {children}
    </div>
  );
}
