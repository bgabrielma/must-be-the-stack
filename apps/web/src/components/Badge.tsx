import type { ReactNode } from "react";

interface BadgeProps {
  icon?: ReactNode;
  children: ReactNode;
  testId?: string;
}

export function Badge({ icon, children, testId = "badge" }: BadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-accent-border bg-accent-bg px-[0.6875rem] py-1 text-xs font-bold text-accent"
      data-testid={testId}
    >
      {icon}
      {children}
    </span>
  );
}
