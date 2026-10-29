"use client";

import { Button } from "./Button";
import { Modal } from "./Modal";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Confirmación antes de una acción que no se puede deshacer */
export function ConfirmDialog({ open, title, message, confirmLabel, loading = false, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Modal open={open} title={title} onClose={() => !loading && onCancel()}>
      <p className="text-muted">{message}</p>
      <div className="mt-8 flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel} disabled={loading} autoFocus>
          Cancelar
        </Button>
        <Button onClick={onConfirm} loading={loading} className="!bg-danger hover:!bg-danger/85">
          {loading ? "Borrando…" : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
