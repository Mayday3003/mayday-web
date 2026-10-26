"use client";

// El texto del botón lo decide el CSS (variante dark), así no hay desfase entre servidor y cliente
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    if (next === "dark") root.dataset.theme = "dark";
    else delete root.dataset.theme;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Sin almacenamiento el tema dura solo esta visita
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Cambiar entre tema claro y oscuro"
      className="font-mono text-xs text-muted hover:text-text"
    >
      <span className="dark:hidden">noche</span>
      <span className="hidden dark:inline">claro</span>
    </button>
  );
}
