import type { ReactNode } from "react";

interface FieldFrameProps {
  label: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
  testId?: string;
}

// The label/error chrome every labelled field shares, including the
// required-field marker: required fields carry an asterisk after the label,
// unmarked means optional, and no field is ever labelled "(optional)". That
// convention is a single decision, so it lives here rather than in each
// control — see `Field` (input) and `TextareaField` (textarea).
export function FieldFrame({
  label,
  htmlFor,
  error,
  required,
  className,
  children,
  testId = "field-frame",
}: FieldFrameProps) {
  const wrapperClasses = ["flex flex-col gap-1.5", className ?? ""].filter(Boolean).join(" ");

  return (
    <div className={wrapperClasses} data-testid={testId}>
      <label htmlFor={htmlFor} className="text-xs font-semibold text-text-h">
        {label}
        {/* Hidden from assistive tech: the control's own `required` already
            announces it, so the asterisk would only be read out twice. */}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-danger">
            *
          </span>
        )}
      </label>
      {children}
      {error && <span className="text-[0.6875rem] text-danger">{error}</span>}
    </div>
  );
}

export function controlClasses(error?: string): string {
  const border = error ? "border-danger-border" : "border-border";
  return `rounded-lg border ${border} bg-bg px-3 py-2.5 text-sm text-text-h`;
}
