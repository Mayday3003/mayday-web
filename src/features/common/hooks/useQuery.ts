"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "../domain/api";

type Result<T> = { key: string; data: T | null; error: ApiError | null };

/**
 * Pide datos cuando cambia `key` y expone los tres estados (cargando, error, datos).
 * "Cargando" se deduce de que el último resultado no corresponde a la key actual,
 * así no hace falta poner estado a mano antes de cada petición.
 */
export function useQuery<T>(key: string, fetcher: () => Promise<T>) {
  const [result, setResult] = useState<Result<T>>({ key: "", data: null, error: null });
  const [attempt, setAttempt] = useState(0);
  const requestKey = `${key}#${attempt}`;

  useEffect(() => {
    let active = true;
    fetcher()
      .then((data) => active && setResult({ key: requestKey, data, error: null }))
      .catch((err: unknown) => {
        const error = err instanceof ApiError ? err : new ApiError(0, "Algo salió mal. Intenta de nuevo.");
        if (active) setResult({ key: requestKey, data: null, error });
      });
    return () => {
      active = false;
    };
    // fetcher cambia en cada render; la petición depende solo de la key
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  const isCurrent = result.key === requestKey;

  return {
    data: isCurrent ? result.data : null,
    error: isCurrent ? result.error : null,
    loading: !isCurrent,
    retry,
  };
}
