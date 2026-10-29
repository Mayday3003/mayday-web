"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/src/features/common/components/Button";
import { Field } from "@/src/features/common/components/Field";
import { focusFirstError } from "@/src/features/common/forms";
import { ApiError, type FieldErrors } from "@/src/features/common/domain/api";
import { useAuth } from "../hooks/useAuth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!EMAIL_RE.test(email)) errors.email = "Ingresa un correo electrónico válido";
  if (!password) errors.password = "La contraseña es obligatoria";
  return errors;
}

/** Solo se aceptan rutas internas en ?next= para no redirigir a otro sitio */
export function safeNext(next: string | null) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState(params.get("expirado") ? "Tu sesión venció. Ingresa de nuevo." : "");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const local = validate(email.trim(), password);
    setErrors(local);
    setFormError("");
    if (Object.keys(local).length) return focusFirstError(formEl);

    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      router.replace(safeNext(params.get("next")));
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.fields ?? {});
        if (err.fields) focusFirstError(formEl);
        // El 401 no dice cuál de los dos campos falló
        setFormError(err.status === 401 ? "El correo o la contraseña no coinciden." : err.fields ? "" : err.message);
      } else {
        setFormError("Algo salió mal. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <Field
        label="Correo"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      <Field
        label="Contraseña"
        name="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />
      {formError && (
        <p role="alert" className="rounded-lg border border-danger/40 px-3 py-2 text-sm text-danger">
          {formError}
        </p>
      )}
      <Button type="submit" loading={loading} className="w-full">
        {loading ? "Entrando…" : "Ingresar"}
      </Button>
      <p className="text-center text-sm text-muted">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="text-accent underline underline-offset-[3px]">
          Regístrate
        </Link>
      </p>
    </form>
  );
}
