import type { Metadata } from "next";
import { Suspense } from "react";
import { GuestRoute } from "@/src/features/common/components/RouteGuards";
import { AuthCard } from "@/src/features/auth/components/AuthCard";
import { LoginForm } from "@/src/features/auth/components/LoginForm";

export const metadata: Metadata = { title: "Ingresar · Mayday" };

export default function LoginPage() {
  return (
    <AuthCard title="Ingresar">
      <Suspense>
        <GuestRoute>
          <LoginForm />
        </GuestRoute>
      </Suspense>
    </AuthCard>
  );
}
