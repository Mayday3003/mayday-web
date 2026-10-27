import type { Metadata } from "next";
import Image from "next/image";
import { facts, projects } from "@/src/features/proyectos/data/proyectos";

export const metadata: Metadata = {
  title: "Proyectos · Mayday",
  description: "Investigación en física espacial y proyectos de Mari: algunos bien, otros a medias.",
};

export default function ProyectosPage() {
  return (
    <div className="mx-auto max-w-[1080px] px-4 sm:px-6">
      <section className="grid items-center gap-10 py-14 md:grid-cols-[1fr_1.2fr] md:py-20">
        <figure className="relative mx-auto w-full max-w-[380px] -rotate-[1.5deg] bg-paper p-3 pb-10 shadow-[3px_3px_0_var(--line)]">
          <div className="relative aspect-[4/3]">
            <Image
              src="/images/proyectos/mari.jpg"
              alt="Mari con un sombrero y gafas de sol"
              fill
              priority
              sizes="(min-width: 768px) 380px, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="absolute bottom-2 left-4 font-hand text-xl text-[#5a768c]">yo, 2026</figcaption>
        </figure>
        <div>
          <h1 className="font-serif text-[56px] leading-none font-medium tracking-tight">MAYDAY</h1>
          <p className="mt-4 text-lg">
            Ojalá algún día ser <span className="text-muted">(astro)</span>física.
          </p>
          <blockquote className="mt-6 border-l-2 border-accent pl-4 font-serif text-xl text-muted italic">
            “To do things that are as complicated and challenging as spaceflight, you have to have all disciplines represented to get the job
            done.”
            <footer className="mt-2 font-mono text-xs not-italic">— Christina Koch</footer>
          </blockquote>
        </div>
      </section>

      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
        {facts.map((fact) => (
          <div key={fact.label} className="bg-bg px-4 py-4">
            <dt className="font-mono text-[11px] tracking-wider text-muted uppercase">{fact.label}</dt>
            <dd className="mt-1 font-serif text-lg">{fact.value}</dd>
          </div>
        ))}
      </dl>

      <section className="py-16">
        <div className="mb-10 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-serif text-[28px] font-medium">Proyectos</h2>
          <p className="font-hand text-xl text-muted">algunos bien, otros a medias</p>
        </div>
        <ol className="relative space-y-10 border-l border-line pl-6 sm:pl-10">
          {projects.map((project) => (
            <li key={project.title} className="relative grid gap-5 sm:grid-cols-[180px_1fr] sm:gap-8">
              <span aria-hidden className="absolute top-2 -left-[29px] size-2.5 rounded-full bg-accent sm:-left-[45px]" />
              <div>
                <p className="font-mono text-sm text-accent">{project.year}</p>
                <div className="relative mt-2 aspect-[4/3] w-full max-w-[220px] bg-paper p-2 shadow-[3px_3px_0_var(--line)]">
                  <div className="relative size-full">
                    <Image src={project.img} alt={project.alt} fill sizes="220px" className="object-cover" />
                  </div>
                </div>
              </div>
              <article>
                <h3 className="font-serif text-2xl">{project.title}</h3>
                <p className="mt-2 max-w-[60ch] text-muted">{project.description}</p>
              </article>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
