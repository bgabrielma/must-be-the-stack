import type { TextareaHTMLAttributes } from "react";
import { FieldFrame, controlClasses } from "./FieldFrame";

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  testId?: string;
}

export function TextareaField({
  label,
  error,
  id,
  className,
  testId,
  required,
  ...props
}: TextareaFieldProps) {
  return (
    <FieldFrame
      label={label}
      htmlFor={id}
      error={error}
      required={required}
      className={className}
      testId={testId ?? id ?? "textarea-field"}
    >
      <textarea
        id={id}
        required={required}
        className={`${controlClasses(error)} min-h-14 resize-y font-sans`}
        {...props}
      />
    </FieldFrame>
  );
}
