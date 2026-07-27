import type { IconProps } from "./Svg";

export function LockedStackMark({ size = 40 }: IconProps) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} aria-hidden="true">
      <rect x="20" y="140" width="160" height="30" rx="6" fill="var(--color-accent)" />
      <path
        d="M92 155 l6 6 l10 -12"
        stroke="white"
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="20" y="100" width="160" height="30" rx="6" fill="var(--color-accent)" fillOpacity={0.6} />
      <rect
        x="20"
        y="60"
        width="160"
        height="30"
        rx="6"
        fill="none"
        stroke="var(--color-accent)"
        strokeOpacity={0.35}
        strokeWidth={3}
        strokeDasharray="6 4"
      />
      <g transform="translate(90,63)">
        <rect x="0" y="10" width="20" height="16" rx="2" fill="var(--color-accent)" fillOpacity={0.35} />
        <path
          d="M4 10 v-4 a6 6 0 0 1 12 0 v4"
          fill="none"
          stroke="var(--color-accent)"
          strokeOpacity={0.35}
          strokeWidth={3}
        />
      </g>
    </svg>
  );
}
