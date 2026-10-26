import Image from "next/image";

const OPTIMIZED_HOSTS = [/\.supabase\.co$/];
const OWN_HOST = /^(www\.)?mayday3003\.world$/;

/**
 * Las fotos heredadas de la Entrega 1 apuntan a mayday3003.world/assets/...
 * Esos archivos viven ahora en public/assets, así que se sirven desde este mismo sitio.
 */
function resolve(url: string): { src: string; optimize: boolean } {
  try {
    const { hostname, pathname } = new URL(url);
    if (OWN_HOST.test(hostname)) return { src: pathname, optimize: true };
    return { src: url, optimize: OPTIMIZED_HOSTS.some((re) => re.test(hostname)) };
  } catch {
    return { src: url, optimize: false };
  }
}

type Props = { src: string | null; alt: string; sizes: string; priority?: boolean };

/** Foto de un recuerdo. Las URLs de otros dominios (propuestas por usuarios) se muestran sin optimizar. */
export function ExperiencePhoto({ src, alt, sizes, priority }: Props) {
  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-surface font-mono text-xs text-muted">
        sin foto
      </div>
    );
  }
  const photo = resolve(src);
  return (
    <Image
      src={photo.src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={!photo.optimize}
      className="object-cover"
    />
  );
}
