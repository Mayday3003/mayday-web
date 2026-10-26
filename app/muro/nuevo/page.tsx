import type { Metadata } from "next";
import { PrivateRoute } from "@/src/features/common/components/RouteGuards";
import { MemoryRequestForm } from "@/src/features/propuestas/components/MemoryRequestForm";

export const metadata: Metadata = { title: "Proponer un recuerdo · Mayday" };

export default function NuevoRecuerdoPage() {
  return (
    <div className="mx-auto max-w-[720px] px-4 py-14 sm:px-6">
      <h1 className="font-serif text-[44px] leading-tight font-medium">Proponer un recuerdo</h1>
      <p className="mt-2 mb-10 text-muted">Cuéntame qué pasó, cuándo y con quién.</p>
      <PrivateRoute>
        <MemoryRequestForm />
      </PrivateRoute>
    </div>
  );
}
