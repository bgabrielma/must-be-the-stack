import type { InputHTMLAttributes } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  testId?: string;
}

export function Field({ label, error, id, className, testId, ...props }: FieldProps) {
  const wrapperClasses = ["flex flex-col gap-1.5", className ?? ""].filter(Boolean).join(" ");
  const inputBorder = error ? "border-danger-border" : "border-border";

  return (
    <div className={wrapperClasses} data-testid={testId ?? id ?? "field"}>
      <label htmlFor={id} className="text-xs font-semibold text-text-h">
        {label}
      </label>
      <input
        id={id}
        className={`rounded-lg border ${inputBorder} bg-bg px-3 py-2.5 text-sm text-text-h`}
        {...props}
      />
      {error && <span className="text-[0.6875rem] text-danger">{error}</span>}
    </div>
  );
}
