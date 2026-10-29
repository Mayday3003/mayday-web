import Link from "next/link";
import { EXPERIENCE_TYPE_LABEL, displayTitle, formatDate, type Experience } from "../domain/experience";
import { ExperiencePhoto } from "./ExperiencePhoto";

// Inclinación fija según el id: la misma foto queda igual en cada visita
const TILTS = ["-rotate-[1.2deg]", "rotate-[0.8deg]", "rotate-0", "-rotate-[0.5deg]", "rotate-[1.3deg]"];

function tiltFor(id: string) {
  let sum = 0;
  for (const char of id) sum += char.charCodeAt(0);
  return TILTS[sum % TILTS.length];
}

export function ExperienceCard({ experience }: { experience: Experience }) {
  const date = formatDate(experience.date);
  const title = displayTitle(experience);

  return (
    <Link
      href={`/muro/${experience.id}`}
      className={`group block ${tiltFor(experience.id)} bg-paper p-3 pb-4 text-[#1c2a38] shadow-[3px_3px_0_var(--line)] hover:shadow-[3px_3px_0_var(--accent)]`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <ExperiencePhoto src={experience.imageUrl} alt={title} sizes="(min-width: 1024px) 340px, (min-width: 640px) 50vw, 100vw" />
      </div>
      <div className="mt-3 px-1">
        <p className="font-mono text-[11px] text-[#5a768c]">
          {EXPERIENCE_TYPE_LABEL[experience.type]}
          {date && ` — ${date}`}
        </p>
        <h3 className="mt-1 font-serif text-xl leading-snug group-hover:underline group-hover:underline-offset-[3px]">
          {title}
        </h3>
        {experience.participants.length > 0 && (
          <p className="mt-1 font-hand text-lg text-[#5a768c]">con {experience.participants.join(", ")}</p>
        )}
      </div>
    </Link>
  );
}
