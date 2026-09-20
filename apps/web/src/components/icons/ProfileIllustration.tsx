export function ProfileIllustration() {
  return (
    <svg viewBox="0 0 200 110" width="167" height="92" aria-hidden="true">
      <rect x="0" y="100" width="200" height="2" fill="var(--color-border)" />
      <rect
        x="40"
        y="16"
        width="120"
        height="76"
        rx="11"
        fill="#fff"
        stroke="var(--color-border)"
        strokeWidth={2}
      />
      <circle cx="68" cy="43" r="13" fill="var(--color-accent)" />
      <circle cx="68" cy="39" r="4.6" fill="#fff" />
      <path d="M59.5 52.5 a8.5 8.5 0 0 1 17 0 z" fill="#fff" />
      <rect x="88" y="35" width="54" height="7" rx="3.5" fill="var(--color-text-h)" fillOpacity={0.78} />
      <rect x="88" y="47" width="36" height="6" rx="3" fill="var(--color-accent)" fillOpacity={0.35} />
      <rect x="56" y="68" width="88" height="5" rx="2.5" fill="var(--color-surface-muted)" />
      <rect x="56" y="78" width="58" height="5" rx="2.5" fill="var(--color-surface-muted)" />
      <circle
        cx="151"
        cy="26"
        r="11"
        fill="var(--color-success-bg)"
        stroke="var(--color-success)"
        strokeWidth={2}
      />
      <path
        d="M146 26 l3.6 3.6 l6.2 -7.2"
        stroke="var(--color-success)"
        strokeWidth={2.6}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
