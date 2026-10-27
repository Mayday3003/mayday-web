import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CameraHero } from "@/src/features/common/components/CameraHero";
import { LatestPhotos } from "@/src/features/experiencias/components/LatestPhotos";
import { Tocadiscos } from "@/src/features/musica/components/Tocadiscos";

// Rotaciones fijas (nunca aleatorias) para que las polaroids parezcan pegadas a mano
const interests = [
  { title: "Física", note: "plasma y fusión", img: "/images/fisica.jpg", alt: "El sol visto por un telescopio", tilt: "-rotate-[1.5deg]" },
  { title: "Tiburones", note: "buceo", img: "/images/tiburones.jpg", alt: "Un banco de tiburones martillo", tilt: "rotate-[1deg] sm:mt-6" },
  { title: "Amor", note: "en todas partes", img: "/images/amor.jpg", alt: "Dos manos entrelazadas", tilt: "-rotate-[0.5deg]" },
];

export const metadata: Metadata = {
  title: "Mayday · Lo que amo (con los que amo)",
  description: "Física, tiburones y recuerdos con las personas que amo.",
};

export default function Home() {
  return (
    <>
      <div className="mx-auto max-w-[1080px] px-4 sm:px-6">
        <section className="grid items-center gap-10 py-14 md:grid-cols-[1.15fr_1fr] md:py-20">
          <figure>
            <CameraHero src="/images/hero.jpg" alt="Mari en la playa de Capurganá al atardecer" />
            <figcaption className="mt-3 font-mono text-xs text-muted">Capurganá, enero de 2025</figcaption>
          </figure>
          <div className="max-w-[46ch]">
            <h1 className="font-serif text-[44px] leading-tight font-medium">
              Lo que amo <em className="text-accent">(con los que amo)</em>
            </h1>
            <p className="mt-4 text-lg text-muted">
              Un espacio para documentar mis intereses, mis{" "}
              <Link href="/proyectos" className="text-accent underline underline-offset-[3px]">
                proyectos de investigación
              </Link>{" "}
              y los{" "}
              <Link href="/muro" className="text-accent underline underline-offset-[3px]">
                recuerdos con personas importantes
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="border-t border-line py-16">
          <h2 className="font-serif text-[28px] font-medium">Lo que de verdad me mueve</h2>
          <ul className="mt-10 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {interests.map((item) => (
              <li key={item.title} className={`relative ${item.tilt}`}>
                <span
                  aria-hidden
                  className="absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 rotate-[-3deg] bg-[#e9dcc2]/80"
                />
                <figure className="bg-paper p-3 pb-4 text-[#1c2a38] shadow-[3px_3px_0_var(--line)]">
                  <div className="relative aspect-[4/3]">
                    <Image src={item.img} alt={item.alt} fill sizes="(min-width: 640px) 320px, 100vw" className="object-cover" />
                  </div>
                  <figcaption className="mt-3 flex items-baseline justify-between px-1">
                    <span className="font-serif text-xl">{item.title}</span>
                    <span className="font-hand text-xl text-[#5a768c]">{item.note}</span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t border-line py-16">
          <div className="mb-10 flex items-baseline justify-between gap-4">
            <h2 className="font-serif text-[28px] font-medium">Últimas fotos</h2>
            <Link href="/muro" className="text-accent underline underline-offset-[3px]">
              Ver el muro
            </Link>
          </div>
          <LatestPhotos count={3} />
        </section>
      </div>

      <section className="border-y border-line bg-surface py-16">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6">
          <h2 className="mb-2 font-serif text-[28px] font-medium">Canciones</h2>
          <p className="mb-10 text-muted">Las que vuelvo a poner sin darme cuenta.</p>
          <Tocadiscos />
        </div>
      </section>
    </>
  );
}
