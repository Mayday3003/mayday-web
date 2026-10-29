import type { Metadata } from "next";
import { Suspense } from "react";
import { BackToWall } from "@/src/features/experiencias/components/BackToWall";
import { ExperienceDetailView } from "@/src/features/experiencias/components/ExperienceDetailView";
import { displayTitle } from "@/src/features/experiencias/domain/experience";
import { experiencesService } from "@/src/features/experiencias/services/experiences.service";

type Params = Promise<{ id: string }>;

// Título de la pestaña con el nombre del recuerdo. Si la API falla (o está dormida), queda uno genérico.
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  try {
    const experience = await experiencesService.getById(id);
    return { title: `${displayTitle(experience)} · Mayday`, description: experience.description.slice(0, 160) };
  } catch {
    return { title: "Recuerdo · Mayday" };
  }
}

// El id solo se conoce al pedir la página, por eso va dentro de Suspense
async function Detail({ params }: { params: Params }) {
  const { id } = await params;
  return <ExperienceDetailView id={id} />;
}

export default function RecuerdoPage({ params }: { params: Params }) {
  return (
    <div className="mx-auto max-w-[760px] px-4 py-12 sm:px-6">
      <BackToWall />
      <div className="mt-8">
        <Suspense>
          <Detail params={params} />
        </Suspense>
      </div>
    </div>
  );
}
