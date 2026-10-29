"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

const linkClass = "underline-offset-[4px] hover:text-accent hover:underline";

/**
 * Franja superior de la navbar con todo lo de la cuenta. Va separada de la navegación
 * del sitio para que con sesión no se amontonen nueve elementos en una sola fila.
 * `children` es lo que siempre va al final a la derecha (el cambio de tema).
 */
export function SessionNav({ children }: { children: React.ReactNode }) {
  const { status, user, isAdmin, logout } = useAuth();
  const router = useRouter();

  let greeting: React.ReactNode = null;
  let actions: React.ReactNode = null;

  if (status === "authenticated" && user) {
    // Saludo y salida juntos a la izquierda: lo de la cuenta queda en un solo grupo
    greeting = (
      <>
        <span className="min-w-0 truncate font-hand text-lg leading-none">hola, {user.name.split(" ")[0]}</span>
        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/");
          }}
          aria-label="Salir"
          title="Salir"
          className="-m-3.5 shrink-0 rounded p-3.5 hover:text-danger"
        >
          {/* Puerta con flecha hacia afuera: el nombre accesible lo da aria-label */}
          <svg viewBox="0 0 24 24" aria-hidden className="size-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="M16 17l5-5-5-5" />
            <path d="M21 12H9" />
          </svg>
        </button>
      </>
    );
    actions = (
      <>
        <Link href="/mis-recuerdos" className={linkClass}>
          Mis recuerditos
        </Link>
        {isAdmin && (
          <Link href="/admin" className={linkClass}>
            {/* En móvil no cabe la palabra completa junto a lo demás */}
            <span className="sm:hidden">Admin</span>
            <span className="hidden sm:inline">Administración</span>
          </Link>
        )}
      </>
    );
  } else if (status === "guest") {
    actions = (
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
    <div className="mx-auto flex min-h-10 max-w-[1080px] items-center justify-between gap-4 px-4 text-[13px] text-muted sm:px-6">
      <div className="flex min-w-0 items-center gap-3">{greeting}</div>
      <div className="flex shrink-0 items-center gap-4 sm:gap-5">
        {actions}
        {actions && <span aria-hidden className="h-3 w-px bg-line" />}
        {children}
      </div>
    </div>
  );
}
