import type { Metadata } from "next";
import { Suspense } from "react";
import { GuestRoute } from "@/src/features/common/components/RouteGuards";
import { AuthCard } from "@/src/features/auth/components/AuthCard";
import { RegisterForm } from "@/src/features/auth/components/RegisterForm";

export const metadata: Metadata = { title: "Crear cuenta · Mayday" };

export default function RegisterPage() {
  return (
    <AuthCard title="Crear cuenta" note="Para comentar y proponer recuerdos.">
      <Suspense>
        <GuestRoute>
          <RegisterForm />
        </GuestRoute>
      </Suspense>
    </AuthCard>
  );
}
