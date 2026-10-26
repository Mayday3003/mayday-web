import { useId } from "react";

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

/** Input con su label y el error debajo, conectados por aria-describedby */
export function Field({ label, error, className = "", ...props }: FieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`mt-1.5 w-full rounded-lg border bg-bg px-3 py-2.5 outline-none focus:border-accent focus:ring-1 focus:ring-accent ${
          error ? "border-danger" : "border-line"
        }`}
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
