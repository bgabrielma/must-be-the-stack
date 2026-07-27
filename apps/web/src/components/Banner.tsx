import type { ReactNode } from "react";

interface BannerProps {
  variant: "info" | "success" | "danger";
  icon: ReactNode;
  title: string;
  description: string;
  testId?: string;
}

const variantClasses: Record<BannerProps["variant"], string> = {
  info: "bg-accent-bg border-accent-border text-accent",
  success: "bg-success-bg border-success text-success",
  danger: "bg-danger-bg border-danger-border text-danger",
};

export function Banner({ variant, icon, title, description, testId = "banner" }: BannerProps) {
  return (
    <div
      className={`mb-4 flex items-start gap-2.5 rounded-card border px-3.5 py-3 ${variantClasses[variant]}`}
      data-testid={testId}
    >
      {icon}
      <div>
        <p className="mb-0.5 text-[0.78125rem] leading-[1.2] font-semibold text-text-h">{title}</p>
        <p className="text-xs leading-[1.35] text-text-h opacity-85">{description}</p>
      </div>
    </div>
  );
}
