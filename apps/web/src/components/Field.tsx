import type { InputHTMLAttributes } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Field({ label, error, id, className, ...props }: FieldProps) {
  const classes = ["field", error ? "is-error" : "", className ?? ""].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      <label htmlFor={id}>{label}</label>
      <input id={id} {...props} />
      {error && <span className="error-msg">{error}</span>}
    </div>
  );
}
