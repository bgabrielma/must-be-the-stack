import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

export type ButtonVariants = VariantProps<typeof buttonClasses>;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {
  testId?: string;
}

export const buttonClasses = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      variant: {
        primary: "bg-accent text-white",
        secondary: "bg-transparent text-accent border border-accent-border",
      },
      size: {
        md: "text-sm px-5 py-[11px]",
        sm: "text-[13px] px-3.5 py-[7px]",
      },
      block: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export function Button({ variant, size, block, className, type = "button", testId = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, block, className })}
      data-testid={testId}
      {...props}
    />
  );
}
