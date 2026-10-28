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
    greeting = <span className="font-hand text-lg leading-none">hola, {user.name.split(" ")[0]}</span>;
    actions = (
      <>
        <Link href="/mis-recuerdos" className={linkClass}>
          Mis recuerdos
        </Link>
        {isAdmin && (
          <Link href="/admin" className={linkClass}>
            {/* En móvil no cabe la palabra completa junto a lo demás */}
            <span className="sm:hidden">Admin</span>
            <span className="hidden sm:inline">Administración</span>
          </Link>
        )}
        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="underline-offset-[4px] hover:text-danger hover:underline"
        >
          Salir
        </button>
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
      <div className="min-w-0 truncate">{greeting}</div>
      <div className="flex shrink-0 items-center gap-4 sm:gap-5">
        {actions}
        {actions && <span aria-hidden className="h-3 w-px bg-line" />}
        {children}
      </div>
    </div>
  );
}
