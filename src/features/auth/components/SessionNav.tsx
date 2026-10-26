"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ButtonLink } from "@/src/features/common/components/ButtonLink";
import { useAuth } from "../hooks/useAuth";

const linkClass = "underline-offset-[5px] hover:text-accent hover:underline";

/** Parte de la navbar que cambia según la sesión */
export function SessionNav() {
  const { status, user, isAdmin, logout } = useAuth();
  const router = useRouter();

  // Mientras se lee la sesión se reserva el espacio para que la navbar no salte
  if (status === "loading") return <span className="h-8 w-40" aria-hidden />;

  if (status === "guest" || !user) {
    return (
      <div className="flex items-center gap-5">
        <Link href="/login" className={linkClass}>
          Ingresar
        </Link>
        <ButtonLink href="/registro" variant="secondary" className="px-3 py-1.5 text-sm">
          Crear cuenta
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
      <Link href="/mis-recuerdos" className={linkClass}>
        Mis recuerdos
      </Link>
      {isAdmin && (
        <Link href="/admin" className={linkClass}>
          Administración
        </Link>
      )}
      <span className="font-hand text-xl text-muted">hola, {user.name.split(" ")[0]}</span>
      <button
        type="button"
        onClick={() => {
          logout();
          router.push("/");
        }}
        className="text-sm text-muted underline underline-offset-[3px] hover:text-danger"
      >
        Salir
      </button>
      <ButtonLink href="/muro/nuevo" className="px-3 py-1.5 text-sm">
        + Añadir recuerdo
      </ButtonLink>
    </div>
  );
}
