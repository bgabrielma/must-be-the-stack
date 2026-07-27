import type { ReactNode } from "react";

export interface IconProps {
  size?: number;
}

export function Svg({ size = 14, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}
