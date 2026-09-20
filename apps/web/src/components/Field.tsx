import type { InputHTMLAttributes } from "react";
import { FieldFrame, controlClasses } from "./FieldFrame";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  testId?: string;
}

export function Field({ label, error, id, className, testId, required, ...props }: FieldProps) {
  return (
    <FieldFrame
      label={label}
      htmlFor={id}
      error={error}
      required={required}
      className={className}
      testId={testId ?? id ?? "field"}
    >
      <input id={id} required={required} className={controlClasses(error)} {...props} />
    </FieldFrame>
  );
}
