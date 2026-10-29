import type { User } from "@/src/features/auth/domain/auth";

export type ExperienceType = "viaje" | "situacion" | "experiencia";

export const EXPERIENCE_TYPE_LABEL: Record<ExperienceType, string> = {
  viaje: "viaje",
  situacion: "situación",
  experiencia: "experiencia",
};

export type Experience = {
  id: string;
  title: string;
  type: ExperienceType;
  description: string;
  imageUrl: string | null;
  /** AAAA-MM-DD en UTC (la API manda medianoche UTC) */
  date: string | null;
  participants: string[];
  createdAt: string;
  updatedAt: string;
};

export type ExperienceComment = {
  id: string;
  content: string;
  createdAt: string;
  user: Pick<User, "id" | "name">;
};

export type ExperienceDetail = Experience & {
  interactions: ExperienceComment[];
  /** Quien propuso el recuerdo; null si lo creó el admin */
  authorId: string | null;
};

export type ExperienceFilters = {
  page?: number;
  limit?: number;
  search?: string;
  type?: ExperienceType;
  participant?: string;
  from?: string;
  to?: string;
};

/** Lo que el admin envía al crear o editar. `null` borra la fecha o la imagen. */
export type ExperienceInput = {
  title: string;
  type: ExperienceType;
  description: string;
  date: string | null;
  participants: string[];
};

export type ExperienceMeta = {
  types: ExperienceType[];
  participants: string[];
};

/**
 * El título es opcional en las propuestas: sin él se nombra por tipo y fecha ("Viaje · 3 de enero de 2025"),
 * así ninguna tarjeta, enlace o aviso queda vacío.
 */
export function displayTitle(item: { title: string; type: ExperienceType; date?: string | null }) {
  if (item.title.trim()) return item.title;
  const date = formatDate(item.date ?? null);
  return date ? `${EXPERIENCE_TYPE_LABEL[item.type]} · ${date}` : `${EXPERIENCE_TYPE_LABEL[item.type]} sin título`;
}

/** "12 de noviembre de 2025". Se formatea en UTC para que no se corra un día. */
export function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "long", timeZone: "UTC" }).format(new Date(iso));
}
