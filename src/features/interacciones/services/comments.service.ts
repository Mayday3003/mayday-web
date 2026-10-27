import { http } from "@/src/features/common/http";
import type { AuthoredComment, Comment, CreateCommentRequest } from "../domain/comment";

export const commentsService = {
  create: (data: CreateCommentRequest) => http.post<Comment>("/api/interacciones", data),
  mine: () => http.get<Comment[]>("/api/interacciones/mias"),
  // Solo admin
  all: () => http.get<AuthoredComment[]>("/api/interacciones"),
};
