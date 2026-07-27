import type { ButtonHTMLAttributes } from "react";

interface ButtonVariants {
  variant?: "primary" | "secondary";
  size?: "sm" | "md";
  block?: boolean;
  className?: string;
}

const base =
  "inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-60";

const variantClasses: Record<NonNullable<ButtonVariants["variant"]>, string> = {
  primary: "bg-accent text-white",
  secondary: "bg-transparent text-accent border border-accent-border",
};

const sizeClasses: Record<NonNullable<ButtonVariants["size"]>, string> = {
  md: "text-sm px-5 py-[11px]",
  sm: "text-[13px] px-3.5 py-[7px]",
};

export function buttonClasses({ variant = "primary", size = "md", block = false, className }: ButtonVariants) {
  return [base, variantClasses[variant], sizeClasses[size], block ? "w-full" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {}

export function Button({ variant, size, block, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses({ variant, size, block, className })} {...props} />;
}
