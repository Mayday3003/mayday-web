import type { ExperienceType } from "@/src/features/experiencias/domain/experience";

export type CreateCommentRequest = { content: string; experienceId: string };

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  experience: { id: string; title: string; type: ExperienceType };
};

/** Como lo ve el admin: con el autor */
export type AuthoredComment = Comment & { user: { id: string; name: string; email: string } };
