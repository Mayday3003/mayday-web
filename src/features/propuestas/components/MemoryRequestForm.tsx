"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/src/features/common/components/Button";
import { Field } from "@/src/features/common/components/Field";
import { ApiError, type FieldErrors } from "@/src/features/common/domain/api";
import { EXPERIENCE_TYPE_LABEL, type ExperienceType } from "@/src/features/experiencias/domain/experience";
import { ImageUploader } from "@/src/features/experiencias/components/ImageUploader";
import { useExperienceMeta } from "@/src/features/experiencias/hooks/useExperiences";
import type { CreateMemoryRequest, MemoryRequest } from "../domain/memory-request";
import { useCreateRequest, useUpdateRequest } from "../hooks/useRequests";

const TYPES = Object.keys(EXPERIENCE_TYPE_LABEL) as ExperienceType[];
type ImageSource = "archivo" | "enlace";
const control =
  "mt-1.5 w-full rounded-lg border bg-bg px-3 py-2.5 outline-none focus:border-accent focus:ring-1 focus:ring-accent";

// Mismas reglas que el DTO de propuestas en la API
// La foto es obligatoria: o un archivo o un enlace. Al editar vale la que ya tenía
function validate(data: CreateMemoryRequest, file: File | null, source: ImageSource, hasImage: boolean): FieldErrors {
  const errors: FieldErrors = {};
  if (data.title.length > 150) errors.title = "El título no puede pasar de 150 caracteres";
  if (source === "archivo" && !file && !hasImage) errors.image = "Sube una foto del recuerdo";
  if (source === "enlace" && !data.imageUrl) errors.imageUrl = "Pega el enlace de la foto";
  if (data.imageUrl && !/^https?:\/\/\S+$/.test(data.imageUrl)) errors.imageUrl = "Escribe una URL que empiece por http:// o https://";
  if (data.date && data.date > new Date().toISOString().slice(0, 10)) errors.date = "La fecha no puede estar en el futuro";
  return errors;
}

type MemoryRequestFormProps = {
  /** Sin propuesta es "crear"; con ella, editar esa propuesta pendiente */
  request?: MemoryRequest;
  onSaved?: (photoFailed: boolean) => void;
  onCancel?: () => void;
};

export function MemoryRequestForm({ request, onSaved, onCancel }: MemoryRequestFormProps) {
  const router = useRouter();
  const createRequest = useCreateRequest();
  const updateRequest = useUpdateRequest(request?.id ?? "");
  const meta = useExperienceMeta();
  const [form, setForm] = useState({
    title: request?.title ?? "",
    type: request?.type ?? ("viaje" as ExperienceType),
    description: request?.description ?? "",
    date: request?.date?.slice(0, 10) ?? "",
    imageUrl: "",
  });
  const [participants, setParticipants] = useState<string[]>(request?.participants ?? []);
  const [newPerson, setNewPerson] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [imageSource, setImageSource] = useState<ImageSource>("archivo");
  const [file, setFile] = useState<File | null>(null);

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function togglePerson(name: string) {
    setParticipants((list) => (list.includes(name) ? list.filter((p) => p !== name) : [...list, name]));
  }

  function addPerson() {
    const name = newPerson.trim();
    if (name && !participants.includes(name)) setParticipants((list) => [...list, name]);
    setNewPerson("");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data: CreateMemoryRequest = {
      title: form.title.trim(),
      type: form.type,
      description: form.description.trim(),
      participants,
      ...(form.date && { date: form.date }),
      // Solo cuenta la opción elegida: el archivo se sube aparte, después de crear la propuesta
      ...(imageSource === "enlace" && form.imageUrl.trim() && { imageUrl: form.imageUrl.trim() }),
    };
    const local = validate(data, file, imageSource, !!request?.imageUrl);
    setErrors(local);
    setFormError("");
    if (Object.keys(local).length) return;

    setLoading(true);
    try {
      const { imageFailed } = await (request ? updateRequest : createRequest)(data, imageSource === "archivo" ? file : null);
      if (onSaved) {
        onSaved(imageFailed);
        setLoading(false);
        return;
      }
      router.push(`/mis-recuerdos?enviado=1${imageFailed ? "&foto=fallo" : ""}`);
    } catch (err) {
      if (err instanceof ApiError && err.fields) setErrors(err.fields);
      else setFormError(err instanceof ApiError ? err.message : "No se pudo enviar. Intenta de nuevo.");
      setLoading(false);
    }
  }

  const known = [...new Set([...(meta.data?.participants ?? []), ...participants])];
  const preview = form.imageUrl.trim();

  return (
    <form
      onSubmit={onSubmit}
      // Enter en un campo de texto enviaría el formulario a medio llenar: solo se envía con el botón
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.target instanceof HTMLInputElement) e.preventDefault();
      }}
      noValidate
      className="space-y-6"
    >
      <Field label="Título (opcional)" value={form.title} onChange={update("title")} error={errors.title} maxLength={150} />

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Tipo</span>
          <select value={form.type} onChange={update("type")} className={`${control} border-line capitalize`}>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {EXPERIENCE_TYPE_LABEL[t]}
              </option>
            ))}
          </select>
        </label>
        <Field label="Fecha" type="date" value={form.date} onChange={update("date")} error={errors.date} />
      </div>

      <label className="block">
        <span className="text-sm font-medium">Descripción (opcional)</span>
        <textarea
          rows={5}
          value={form.description}
          onChange={update("description")}
          aria-invalid={errors.description ? true : undefined}
          aria-describedby={errors.description ? "description-error" : undefined}
          className={`${control} ${errors.description ? "border-danger" : "border-line"}`}
        />
        {errors.description && (
          <span id="description-error" className="mt-1.5 block text-sm text-danger">
            {errors.description}
          </span>
        )}
      </label>

      <fieldset>
        <legend className="text-sm font-medium">Personas presentes</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {known.map((name) => {
            const on = participants.includes(name);
            return (
              <button
                key={name}
                type="button"
                aria-pressed={on}
                onClick={() => togglePerson(name)}
                className={`rounded-full border px-3 py-1 text-sm ${on ? "border-accent bg-accent text-bg" : "border-line hover:border-accent"}`}
              >
                {name}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex gap-2">
          <label htmlFor="nueva-persona" className="sr-only">
            Nueva persona
          </label>
          <input
            id="nueva-persona"
            value={newPerson}
            onChange={(e) => setNewPerson(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addPerson();
              }
            }}
            placeholder="Otra persona"
            maxLength={100}
            className="min-w-0 flex-1 rounded-lg border border-line bg-bg px-3 py-2 outline-none focus:border-accent"
          />
          <Button type="button" variant="secondary" onClick={addPerson}>
            Agregar
          </Button>
        </div>
        {errors.participants && <p className="mt-1.5 text-sm text-danger">{errors.participants}</p>}
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium">Foto *</legend>
        <div role="radiogroup" className="mt-2 mb-4 flex gap-2">
          {(["archivo", "enlace"] as ImageSource[]).map((source) => (
            <button
              key={source}
              type="button"
              role="radio"
              aria-checked={imageSource === source}
              onClick={() => setImageSource(source)}
              className={`rounded-full border px-3 py-1 text-sm ${imageSource === source ? "border-accent bg-accent text-bg" : "border-line hover:border-accent"}`}
            >
              {source === "archivo" ? "Desde mi dispositivo" : "Con un enlace"}
            </button>
          ))}
        </div>

        {imageSource === "archivo" ? (
          <ImageUploader currentUrl={request?.imageUrl ?? null} error={errors.image} onChange={setFile} />
        ) : (
          <div>
            <Field
              label="URL de la imagen"
              type="url"
              inputMode="url"
              placeholder="https://"
              value={form.imageUrl}
              onChange={(e) => {
                setPreviewFailed(false);
                update("imageUrl")(e);
              }}
              error={errors.imageUrl}
            />
            {preview && /^https?:\/\//.test(preview) && (
              <div className="mt-3 w-48 bg-paper p-2 shadow-[3px_3px_0_var(--line)]">
                {previewFailed ? (
                  <p className="p-4 text-sm text-danger">No se pudo cargar esa imagen.</p>
                ) : (
                  // Vista previa de una URL cualquiera: next/image no sirve para dominios desconocidos
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="Vista previa" className="aspect-[4/3] w-full object-cover" onError={() => setPreviewFailed(true)} />
                )}
              </div>
            )}
          </div>
        )}
      </fieldset>

      {formError && (
        <p role="alert" className="rounded-lg border border-danger/40 px-3 py-2 text-sm text-danger">
          {formError}
        </p>
      )}

      <div className="flex items-center gap-4 border-t border-line pt-6">
        <Button type="submit" loading={loading}>
          {request ? (loading ? "Guardando…" : "Guardar cambios") : loading ? "Enviando…" : "Enviar propuesta"}
        </Button>
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
        ) : (
          <p className="text-sm text-muted">La reviso antes de que aparezca en el muro.</p>
        )}
      </div>
    </form>
  );
}
