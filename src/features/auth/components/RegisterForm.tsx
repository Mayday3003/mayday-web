"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/src/features/common/components/Button";
import { Field } from "@/src/features/common/components/Field";
import { focusFirstError } from "@/src/features/common/forms";
import { ApiError, type FieldErrors } from "@/src/features/common/domain/api";
import type { RegisterRequest } from "../domain/auth";
import { useAuth } from "../hooks/useAuth";
import { safeNext } from "./LoginForm";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mismas reglas que RegisterUserDto en la API
function validate({ name, email, password }: RegisterRequest): FieldErrors {
  const errors: FieldErrors = {};
  if (name.length < 2 || name.length > 100) errors.name = "El nombre debe tener entre 2 y 100 caracteres";
  if (!EMAIL_RE.test(email)) errors.email = "Ingresa un correo electrónico válido";
  if (password.length < 8) errors.password = "La contraseña debe tener al menos 8 caracteres";
  return errors;
}

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [form, setForm] = useState<RegisterRequest>({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: keyof RegisterRequest) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const data = { name: form.name.trim(), email: form.email.trim(), password: form.password };
    const local = validate(data);
    setErrors(local);
    setFormError("");
    if (Object.keys(local).length) return focusFirstError(formEl);

    setLoading(true);
    try {
      await register(data);
      router.replace(safeNext(params.get("next")));
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setErrors({ email: "Ya existe una cuenta con este correo" });
        focusFirstError(formEl);
      } else if (err instanceof ApiError && err.fields) {
        setErrors(err.fields);
        focusFirstError(formEl);
      } else {
        setFormError(err instanceof ApiError ? err.message : "Algo salió mal. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <Field label="Nombre" name="name" autoComplete="name" value={form.name} onChange={update("name")} error={errors.name} />
      <Field
        label="Correo"
        name="email"
        type="email"
        autoComplete="email"
        value={form.email}
        onChange={update("email")}
        error={errors.email}
      />
      <Field
        label="Contraseña"
        name="password"
        type="password"
        autoComplete="new-password"
        value={form.password}
        onChange={update("password")}
        error={errors.password}
      />
      {formError && (
        <p role="alert" className="rounded-lg border border-danger/40 px-3 py-2 text-sm text-danger">
          {formError}
        </p>
      )}
      <Button type="submit" loading={loading} className="w-full">
        {loading ? "Creando cuenta…" : "Crear cuenta"}
      </Button>
      <p className="text-center text-sm text-muted">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-accent underline underline-offset-[3px]">
          Ingresa
        </Link>
      </p>
    </form>
  );
}
