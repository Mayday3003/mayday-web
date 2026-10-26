import Image from "next/image";

type CameraHeroProps = {
  src: string;
  alt: string;
};

// La foto se monta sobre la pantalla LCD de camara.png (medidas en DISENO.md §D10)
export function CameraHero({ src, alt }: CameraHeroProps) {
  return (
    <div className="relative aspect-[1011/666] w-full max-w-[560px]">
      <Image src="/images/camara.png" alt="" fill priority sizes="(min-width: 640px) 560px, 100vw" />
      <div className="absolute top-[31.53%] left-[6.43%] h-[55.26%] w-[48.17%] overflow-hidden">
        <Image src={src} alt={alt} fill priority sizes="(min-width: 640px) 270px, 48vw" className="object-cover" />
      </div>
    </div>
  );
}
