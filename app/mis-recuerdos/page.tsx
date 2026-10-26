import type { Metadata } from "next";
import { Suspense } from "react";
import { PrivateRoute } from "@/src/features/common/components/RouteGuards";
import { MyMemories } from "@/src/features/propuestas/components/MyMemories";

export const metadata: Metadata = { title: "Mis recuerdos · Mayday" };

export default function MisRecuerdosPage() {
  return (
    <div className="mx-auto max-w-[720px] px-4 py-14 sm:px-6">
      <h1 className="mb-10 font-serif text-[44px] leading-tight font-medium">Mis recuerdos</h1>
      <Suspense>
        <PrivateRoute>
          <MyMemories />
        </PrivateRoute>
      </Suspense>
    </div>
  );
}
