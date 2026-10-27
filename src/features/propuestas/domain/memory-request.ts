import type { ExperienceType } from "@/src/features/experiencias/domain/experience";

export type RequestStatus = "pendiente" | "aprobada" | "rechazada";

export type CreateMemoryRequest = {
  title: string;
  type: ExperienceType;
  description: string;
  imageUrl?: string;
  date?: string;
  participants: string[];
};

export type MemoryRequest = CreateMemoryRequest & {
  id: string;
  status: RequestStatus;
  experienceId: string | null;
  imageUrl: string | null;
  date: string | null;
  createdAt: string;
};

/** Como la ve el admin: con el autor */
export type ReviewedMemoryRequest = MemoryRequest & { user: { id: string; name: string; email: string } };
