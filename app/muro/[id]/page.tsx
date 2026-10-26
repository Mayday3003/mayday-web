import Link from "next/link";
import { Suspense } from "react";
import { ExperienceDetailView } from "@/src/features/experiencias/components/ExperienceDetailView";

type Params = Promise<{ id: string }>;

// El id solo se conoce al pedir la página, por eso va dentro de Suspense
async function Detail({ params }: { params: Params }) {
  const { id } = await params;
  return <ExperienceDetailView id={id} />;
}

export default function RecuerdoPage({ params }: { params: Params }) {
  return (
    <div className="mx-auto max-w-[760px] px-4 py-12 sm:px-6">
      <Link href="/muro" className="text-sm text-muted underline-offset-[3px] hover:text-accent hover:underline">
        ← volver al muro
      </Link>
      <div className="mt-8">
        <Suspense>
          <Detail params={params} />
        </Suspense>
      </div>
    </div>
  );
}
