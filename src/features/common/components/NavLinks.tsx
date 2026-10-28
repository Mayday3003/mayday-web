"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/muro", label: "Recuerditos" },
];

/** Navegación del sitio; marca la sección actual (el muro incluye su detalle y /muro/nuevo) */
export function NavLinks() {
  return <NavList pathname={usePathname()} />;
}

/** Sin pathname (mientras carga) se ven los mismos enlaces sin marcar ninguno */
export function NavList({ pathname }: { pathname: string | null }) {
  return (
    <nav aria-label="Principal">
      <ul className="flex gap-7">
        {links.map((link) => {
          const active = pathname !== null && (link.href === "/" ? pathname === "/" : pathname.startsWith(link.href));
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`underline-offset-[5px] hover:text-accent hover:underline ${active ? "text-accent underline decoration-1" : ""}`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
