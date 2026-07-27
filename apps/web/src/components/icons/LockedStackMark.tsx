import type { IconProps } from "./Svg";

// The bare "Locked Stack" mark: three stacked bars, bottom-up, reading as
// passing (solid) / in progress (mid-opacity) / locked (dashed outline).
// Colored via `currentColor` so callers control it (e.g. `text-accent` on a
// light background, or `text-white` inside an accent-filled badge) — it does
// not assume a badge/background of its own. See `BrandMark` for the
// accent-badge composition used in the Auth screen headers.
export function LockedStackMark({ size = 40 }: IconProps) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} aria-hidden="true">
      <rect x="20" y="140" width="160" height="30" rx="6" fill="currentColor" />
      <path
        d="M92 155 l6 6 l10 -12"
        stroke="var(--color-accent)"
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="20" y="100" width="160" height="30" rx="6" fill="currentColor" fillOpacity={0.65} />
      <rect
        x="20"
        y="60"
        width="160"
        height="30"
        rx="6"
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.45}
        strokeWidth={3}
        strokeDasharray="6 4"
      />
      <g transform="translate(90,63)">
        <rect x="0" y="10" width="20" height="16" rx="2" fill="currentColor" fillOpacity={0.45} />
        <path
          d="M4 10 v-4 a6 6 0 0 1 12 0 v4"
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.45}
          strokeWidth={3}
        />
      </g>
    </svg>
  );
}
