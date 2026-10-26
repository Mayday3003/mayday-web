import type { Metadata } from "next";
import { Suspense } from "react";
import { ButtonLink } from "@/src/features/common/components/ButtonLink";
import { ExperienceFilters } from "@/src/features/experiencias/components/ExperienceFilters";
import { ExperienceWall } from "@/src/features/experiencias/components/ExperienceWall";

export const metadata: Metadata = {
  title: "Recuerditos · Mayday",
  description: "Muro de viajes, situaciones y experiencias con las personas que amo.",
};

export default function MuroPage() {
  return (
    <div className="mx-auto max-w-[1080px] px-4 py-14 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-serif text-[44px] leading-tight font-medium">Recuerditos</h1>
          <p className="mt-1 max-w-[52ch] text-muted">Viajes, situaciones y experiencias con las personas que quiero.</p>
        </div>
        <ButtonLink href="/muro/nuevo">+ Añadir recuerdo</ButtonLink>
      </header>

      <Suspense>
        <div className="mt-10 border-b border-line pb-6">
          <ExperienceFilters />
        </div>
        <div className="mt-12">
          <ExperienceWall />
        </div>
      </Suspense>
    </div>
  );
}

