import type { RequestStatus } from "../domain/memory-request";

const STYLE: Record<RequestStatus, string> = {
  pendiente: "border-stamp text-stamp",
  aprobada: "border-ok text-ok",
  rechazada: "border-danger text-danger",
};

/** Sello de estado: mayúsculas pequeñas, borde y un poco inclinado */
export function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={`inline-block -rotate-[4deg] rounded-sm border-[1.5px] px-2 py-0.5 font-mono text-[11px] tracking-wider uppercase ${STYLE[status]}`}
    >
      {status}
    </span>
  );
}
