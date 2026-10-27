import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminPanel } from "@/src/features/common/components/AdminPanel";
import { AdminRoute } from "@/src/features/common/components/RouteGuards";

export const metadata: Metadata = { title: "Panel · Mayday" };

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-[960px] px-4 py-14 sm:px-6">
      <h1 className="mb-10 font-serif text-[44px] leading-tight font-medium">Panel de administración</h1>
      <Suspense>
        <AdminRoute>
          <AdminPanel />
        </AdminRoute>
      </Suspense>
    </div>
  );
}
