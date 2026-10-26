import Link from "next/link";

type Variant = "primary" | "secondary";

const base = "inline-flex items-center justify-center rounded-lg px-4 py-2 text-[15px]";

export const buttonVariants: Record<Variant, string> = {
  primary: `${base} bg-accent text-bg hover:bg-accent-strong`,
  secondary: `${base} border border-line bg-bg/60 hover:border-accent hover:text-accent`,
};

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
};

export function ButtonLink({ href, variant = "primary", className = "", children }: ButtonLinkProps) {
  return (
    <Link href={href} className={`${buttonVariants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
