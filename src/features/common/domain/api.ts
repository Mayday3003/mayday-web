/** Errores por campo, con el mismo formato que devuelve la API en `error.fields` */
export type FieldErrors = Record<string, string>;

/** Error normalizado de cualquier petición. `status: 0` significa que no hubo conexión. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly fields?: FieldErrors,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type Paginated<T> = {
  pagination: { page: number; limit: number; total: number; totalPages: number };
  data: T[];
};
