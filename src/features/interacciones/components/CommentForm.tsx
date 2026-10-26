"use client";

import { useId, useState } from "react";
import { Button } from "@/src/features/common/components/Button";
import { ApiError } from "@/src/features/common/domain/api";
import { useCreateComment } from "../hooks/useComments";

type Props = { experienceId: string; onCreated: () => void };

export function CommentForm({ experienceId, onCreated }: Props) {
  const createComment = useCreateComment();
  const id = useId();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = content.trim();
    if (text.length < 3) {
      setError("El comentario debe tener al menos 3 caracteres");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await createComment({ content: text, experienceId });
      setContent("");
      onCreated();
    } catch (err) {
      setError(err instanceof ApiError ? (err.fields?.content ?? err.message) : "No se pudo publicar el comentario.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-8">
      <label htmlFor={id} className="block text-sm font-medium">
        Escribe un comentario
      </label>
      <textarea
        id={id}
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`mt-1.5 w-full rounded-lg border bg-bg px-3 py-2.5 outline-none focus:border-accent focus:ring-1 focus:ring-accent ${
          error ? "border-danger" : "border-line"
        }`}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
      <Button type="submit" loading={loading} className="mt-3">
        {loading ? "Publicando…" : "Publicar"}
      </Button>
    </form>
  );
}
