"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

/** Lee y escribe filtros en la URL. Al cambiar cualquier filtro se vuelve a la página 1. */
export function useQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function get(key: string) {
    return searchParams.get(key) ?? undefined;
  }

  function set(changes: Record<string, string | number | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value === undefined || value === "") params.delete(key);
      else params.set(key, String(value));
    }
    if (!("page" in changes)) params.delete("page");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function clear() {
    router.push(pathname, { scroll: false });
  }

  return { get, set, clear, hasAny: searchParams.toString() !== "" };
}
