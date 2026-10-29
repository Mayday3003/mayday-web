import Link from "next/link";
import { Suspense } from "react";
import { SessionNav } from "@/src/features/auth/components/SessionNav";
import { NavLinks, NavList } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <header className="border-b border-line">
      <div className="border-b border-line/60 bg-surface/60">
        <SessionNav>
          <ThemeToggle />
        </SessionNav>
      </div>
      <div className="mx-auto flex max-w-[1080px] flex-col items-center gap-2 px-4 pt-4 pb-4 sm:gap-3 sm:pt-5 sm:px-6">
        <Link href="/" className="font-serif text-4xl italic">
          Mayday <span className="text-accent not-italic">❀</span>
        </Link>
        {/* usePathname necesita Suspense en las páginas con prerender parcial */}
        <Suspense fallback={<NavList pathname={null} />}>
          <NavLinks />
        </Suspense>
      </div>
    </header>
  );
}
