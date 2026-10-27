// Contenido fijo de la Entrega 1. No es el catálogo, así que no viene de la API.

export type Project = {
  year: number;
  title: string;
  description: string;
  img: string;
  alt: string;
};

export const projects: Project[] = [
  {
    year: 2025,
    title: "Observatorio Ultravioleta Lunar",
    description:
      "Misión espacial para hacer la primera reconstrucción 3D de la exósfera terrestre y su interacción con la magnetosfera y el viento solar.",
    img: "/images/proyectos/oul.png",
    alt: "Insignia del Observatorio Ultravioleta Lunar",
  },
  {
    year: 2026,
    title: "Orquídeas",
    description:
      "App móvil para caficultores y estudiantes sobre la realización de biochar para eliminar contaminantes emergentes del agua.",
    img: "/images/proyectos/orquideas.jpg",
    alt: "Cultivo de café del proyecto Orquídeas",
  },
  {
    year: 2027,
    title: "Inestabilidades paramétricas",
    description: "Hipótesis sobre la presencia de inestabilidades paramétricas por ondas de Alfvén en la exósfera terrestre.",
    img: "/images/proyectos/alfven.jpg",
    alt: "Ilustración de ondas de Alfvén en un plasma",
  },
];

export const facts = [
  { label: "Base", value: "Medellín, CO" },
  { label: "Estudio", value: "Computación científica" },
  { label: "Artista fav", value: "The Warning" },
  { label: "Película fav", value: "Imagine Me & You" },
];
