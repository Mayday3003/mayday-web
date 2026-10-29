"use client";

import { useEffect, useId, useState } from "react";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

type ImageUploaderProps = {
  currentUrl: string | null;
  error?: string;
  onChange: (file: File | null) => void;
};

/** Valida tipo y tamaño antes de enviar (las mismas reglas que multer en la API) y muestra la vista previa */
export function ImageUploader({ currentUrl, error, onChange }: ImageUploaderProps) {
  const id = useId();
  const [preview, setPreview] = useState<string | null>(null);
  const [localError, setLocalError] = useState("");

  // La URL temporal del archivo se libera cuando cambia o se desmonta
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setLocalError("");
    setPreview(null);
    onChange(null);
    if (!file) return;

    if (!ALLOWED.includes(file.type)) {
      setLocalError("Solo se aceptan imágenes JPG, PNG, WEBP o GIF");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_BYTES) {
      setLocalError("La imagen pesa más de 10 MB");
      e.target.value = "";
      return;
    }
    setPreview(URL.createObjectURL(file));
    onChange(file);
  }

  const shown = preview ?? currentUrl;
  const message = localError || error;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        Imagen
      </label>
      <div className="mt-2 flex flex-wrap items-center gap-4">
        <div className="w-36 shrink-0 bg-paper p-2 shadow-[3px_3px_0_var(--line)]">
          {shown ? (
            // Vista previa local (blob:) o la imagen actual: next/image no acepta blob:
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shown} alt="Vista previa de la imagen" className="aspect-[4/3] w-full object-cover" />
          ) : (
            <div className="grid aspect-[4/3] place-items-center bg-surface font-mono text-xs text-muted">sin foto</div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <input
            id={id}
            type="file"
            accept={ALLOWED.join(",")}
            onChange={onSelect}
            aria-invalid={message ? true : undefined}
            aria-describedby={`${id}-hint${message ? ` ${id}-error` : ""}`}
            className="block w-full text-sm file:mr-3 file:rounded-lg file:border file:border-line file:bg-bg file:px-3 file:py-1.5 file:text-text hover:file:border-accent"
          />
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
            JPG, PNG, WEBP o GIF · máximo 10 MB
          </p>
          {message && (
            <p id={`${id}-error`} className="mt-1.5 text-sm text-danger">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
