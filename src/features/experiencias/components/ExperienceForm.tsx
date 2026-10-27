"use client";

import { useState } from "react";
import { Button } from "@/src/features/common/components/Button";
import { Field } from "@/src/features/common/components/Field";
import { ApiError, type FieldErrors } from "@/src/features/common/domain/api";
import { EXPERIENCE_TYPE_LABEL, type Experience, type ExperienceInput, type ExperienceType } from "../domain/experience";
import { experiencesService } from "../services/experiences.service";
import { ImageUploader } from "./ImageUploader";

const TYPES = Object.keys(EXPERIENCE_TYPE_LABEL) as ExperienceType[];
const control =
  "mt-1.5 w-full rounded-lg border bg-bg px-3 py-2.5 outline-none focus:border-accent focus:ring-1 focus:ring-accent";

// Mismas reglas que CreateExperienceBodyDto en la API
function validate(data: ExperienceInput): FieldErrors {
  const errors: FieldErrors = {};
  if (data.title.length < 3 || data.title.length > 150) errors.title = "El título debe tener entre 3 y 150 caracteres";
  if (data.description.length < 10) errors.description = "La descripción debe tener al menos 10 caracteres";
  return errors;
}

type ExperienceFormProps = {
  /** Sin experiencia es "crear"; con ella, "editar" */
  experience?: Experience;
  onSaved: (experience: Experience, warning?: string) => void;
  onCancel: () => void;
};

export function ExperienceForm({ experience, onSaved, onCancel }: ExperienceFormProps) {
  const [form, setForm] = useState({
    title: experience?.title ?? "",
    type: experience?.type ?? ("viaje" as ExperienceType),
    description: experience?.description ?? "",
    date: experience?.date?.slice(0, 10) ?? "",
    participants: experience?.participants.join(", ") ?? "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data: ExperienceInput = {
      title: form.title.trim(),
      type: form.type,
      description: form.description.trim(),
      date: form.date || null,
      participants: [...new Set(form.participants.split(",").map((p) => p.trim()).filter(Boolean))],
    };
    const local = validate(data);
    setErrors(local);
    setFormError("");
    if (Object.keys(local).length) return;

    setLoading(true);
    let saved: Experience;
    try {
      saved = experience ? await experiencesService.update(experience.id, data) : await experiencesService.create(data);
    } catch (err) {
      if (err instanceof ApiError && err.fields) setErrors(err.fields);
      else setFormError(err instanceof ApiError ? err.message : "No se pudo guardar. Intenta de nuevo.");
      setLoading(false);
      return;
    }

    // La imagen va en una segunda petición porque necesita el id. Si falla, el recuerdo ya quedó guardado.
    if (file) {
      try {
        saved = await experiencesService.uploadImage(saved.id, file);
      } catch (err) {
        onSaved(saved, `Se guardó, pero la imagen no subió: ${err instanceof ApiError ? err.message : "error desconocido"}`);
        return;
      }
    }
    onSaved(saved);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <Field label="Título *" value={form.title} onChange={update("title")} error={errors.title} maxLength={150} />

      <div className="grid gap-5 sm:grid-cols-2">
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
        <span className="text-sm font-medium">Descripción *</span>
        <textarea
          rows={4}
          value={form.description}
          onChange={update("description")}
          aria-invalid={errors.description ? true : undefined}
          aria-describedby={errors.description ? "exp-description-error" : undefined}
          className={`${control} ${errors.description ? "border-danger" : "border-line"}`}
        />
        {errors.description && (
          <span id="exp-description-error" className="mt-1.5 block text-sm text-danger">
            {errors.description}
          </span>
        )}
      </label>

      <Field
        label="Personas (separadas por coma)"
        value={form.participants}
        onChange={update("participants")}
        error={errors.participants}
        placeholder="Ana, Juli, Mayday"
      />

      <ImageUploader currentUrl={experience?.imageUrl ?? null} error={errors.image} onChange={setFile} />

      {formError && (
        <p role="alert" className="rounded-lg border border-danger/40 px-3 py-2 text-sm text-danger">
          {formError}
        </p>
      )}

      <div className="flex justify-end gap-3 border-t border-line pt-5">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {loading ? "Guardando…" : experience ? "Guardar cambios" : "Crear recuerdo"}
        </Button>
      </div>
    </form>
  );
}
