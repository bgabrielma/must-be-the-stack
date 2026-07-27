import type { ReactNode } from "react";

interface BadgeProps {
  icon?: ReactNode;
  children: ReactNode;
}

export function Badge({ icon, children }: BadgeProps) {
  return (
    <span className="badge">
      {icon}
      {children}
    </span>
  );
}
