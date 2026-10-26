const socials = [
  { href: "https://pin.it/6FbzztlTF", label: "Pinterest" },
  { href: "https://www.instagram.com/mayday_lopera.tif", label: "Instagram" },
  { href: "https://boxd.it/fcKcH", label: "Letterboxd" },
];

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1080px] flex-col gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="font-mono text-xs">mayday3003.world · 2026</p>
        <ul className="flex gap-5">
          {socials.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-[3px] hover:text-accent"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
