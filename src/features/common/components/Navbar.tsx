import Link from "next/link";
import { SessionNav } from "@/src/features/auth/components/SessionNav";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/muro", label: "Recuerditos" },
];

export function Navbar() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-[1080px] flex-col items-center gap-4 px-4 pt-7 pb-5 sm:px-6">
        <Link href="/" className="font-serif text-4xl italic">
          Mayday <span className="text-accent not-italic">❀</span>
        </Link>
        <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
          <ul className="flex gap-7">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="underline-offset-[5px] hover:text-accent hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <span aria-hidden className="hidden h-4 w-px bg-line sm:block" />
          <SessionNav />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
