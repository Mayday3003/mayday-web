"use client";

import { useQuery } from "@/src/features/common/hooks/useQuery";
import type { CreateCommentRequest } from "../domain/comment";
import { commentsService } from "../services/comments.service";

export function useMyComments() {
  return useQuery("comments:mine", () => commentsService.mine());
}

export function useCreateComment() {
  return (data: CreateCommentRequest) => commentsService.create(data);
}

export function useAllComments() {
  return useQuery("comments:all", () => commentsService.all());
}
