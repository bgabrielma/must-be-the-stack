import type { ReactNode } from "react";

interface BadgeProps {
  icon?: ReactNode;
  children: ReactNode;
}

export function Badge({ icon, children }: BadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-accent-border bg-accent-bg px-[11px] py-1 text-xs font-semibold text-accent">
      {icon}
      {children}
    </span>
  );
}
