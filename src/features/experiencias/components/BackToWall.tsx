"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { WALL_QUERY_KEY } from "./ExperienceWall";

/** "← volver al muro" con los filtros y la página que tenía el muro (los guarda ExperienceWall) */
export function BackToWall() {
  const router = useRouter();

  return (
    <Link
      href="/muro"
      onClick={(e) => {
        let query = "";
        try {
          query = sessionStorage.getItem(WALL_QUERY_KEY) ?? "";
        } catch {
          // Sin almacenamiento se vuelve al muro sin filtros
        }
        if (!query) return;
        e.preventDefault();
        router.push(`/muro?${query}`);
      }}
      className="text-sm text-muted underline-offset-[3px] hover:text-accent hover:underline"
    >
      ← volver al muro
    </Link>
  );
}
