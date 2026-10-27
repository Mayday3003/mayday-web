import { NextResponse, type NextRequest } from "next/server";

const TOKEN_COOKIE = "mayday_token";
const PRIVATE = ["/mis-recuerdos", "/muro/nuevo"];
const GUEST_ONLY = ["/login", "/registro"];

/**
 * Lee el rol del payload del JWT sin verificar la firma: aquí el secreto no existe.
 * Esto es solo experiencia de usuario (no mostrar pantallas que no sirven);
 * la seguridad real está en la API, que responde 401 o 403.
 */
function readRole(token: string): string | null {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const data = JSON.parse(atob(payload)) as { role?: unknown; exp?: unknown };
    if (typeof data.exp === "number" && data.exp * 1000 < Date.now()) return null;
    return typeof data.role === "string" ? data.role : null;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const role = token ? readRole(token) : null;

  const redirect = (to: string) => NextResponse.redirect(new URL(to, request.url));
  const toLogin = () => redirect(`/login?next=${encodeURIComponent(pathname + search)}`);

  if (pathname.startsWith("/admin")) {
    if (!role) return toLogin();
    if (role !== "admin") return redirect("/");
  }
  if (PRIVATE.includes(pathname) && !role) return toLogin();
  if (GUEST_ONLY.includes(pathname) && role) {
    const next = request.nextUrl.searchParams.get("next");
    return redirect(next?.startsWith("/") && !next.startsWith("//") ? next : "/");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/mis-recuerdos", "/muro/nuevo", "/admin/:path*", "/login", "/registro"],
};
