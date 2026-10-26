import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[720px] px-4 py-24 sm:px-6">
      <p className="font-mono text-xs text-muted">Error 404</p>
      <h1 className="mt-2 font-serif text-[44px] leading-tight font-medium">Esta página no existe.</h1>
      <p className="mt-4 text-lg text-muted">
        Puede que el link esté mal escrito o que el recuerdo se haya borrado. Vuelve al{" "}
        <Link href="/" className="text-accent underline underline-offset-[3px]">
          inicio
        </Link>{" "}
        o al{" "}
        <Link href="/muro" className="text-accent underline underline-offset-[3px]">
          muro
        </Link>
        .
      </p>
    </div>
  );
}
