export function EntryIllustration() {
  return (
    <svg viewBox="0 0 200 140" width="190" height="133" aria-hidden="true">
      <rect x="0" y="128" width="200" height="2" fill="var(--color-border)" />
      <rect x="14" y="92" width="40" height="38" rx="6" fill="var(--color-surface-muted)" />
      <rect x="66" y="68" width="40" height="62" rx="6" fill="var(--color-accent-bg)" />
      <rect x="118" y="40" width="40" height="90" rx="6" fill="var(--color-accent-bg)" />
      <line x1="138" y1="8" x2="138" y2="40" stroke="var(--color-text-muted)" strokeWidth={2} />
      <path d="M138 8 L160 15 L138 22 Z" fill="var(--color-accent)" />
      <rect x="79" y="48" width="17" height="20" rx="7" fill="var(--color-accent)" />
      <circle cx="87.5" cy="42" r="9" fill="var(--color-accent)" />
      <circle cx="84.5" cy="41" r="1.4" fill="#fff" />
      <circle cx="90.5" cy="41" r="1.4" fill="#fff" />
    </svg>
  );
}
