"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { safeNext } from "@/src/features/auth/components/LoginForm";
import { useAuth } from "@/src/features/auth/hooks/useAuth";

function Checking() {
  return (
    <p role="status" className="mx-auto max-w-[720px] px-4 py-24 text-muted sm:px-6">
      Revisando tu sesión…
    </p>
  );
}

/** Sin sesión manda a /login?next=<ruta actual>. Nunca pinta el contenido antes de saberlo. */
export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "guest") router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [status, router, pathname]);

  return status === "authenticated" ? children : <Checking />;
}

/** Solo admin: sin sesión va a /login y con rol user vuelve al inicio. La API igual responde 403. */
export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { status, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "guest") router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    else if (status === "authenticated" && !isAdmin) router.replace("/");
  }, [status, isAdmin, router, pathname]);

  return status === "authenticated" && isAdmin ? children : <Checking />;
}

/**
 * Login y registro: con sesión no tiene sentido verlos. Va al mismo ?next= que el formulario,
 * así el redirect de después de ingresar y el de este guard nunca apuntan a sitios distintos.
 */
export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();
  const next = useSearchParams().get("next");

  useEffect(() => {
    if (status === "authenticated") router.replace(safeNext(next));
  }, [status, router, next]);

  return status === "guest" ? children : <Checking />;
}
