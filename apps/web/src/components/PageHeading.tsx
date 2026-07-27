import type { ReactNode } from "react";

interface PageHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  testId?: string;
}

export function PageHeading({ eyebrow, title, testId = "page-heading" }: PageHeadingProps) {
  return (
    <div data-testid={testId}>
      {eyebrow && (
        <p className="mb-1 font-heading text-[11px] font-semibold tracking-[0.06em] text-accent uppercase">
          {eyebrow}
        </p>
      )}
      <h1 className="font-heading text-2xl leading-[1.15] font-bold tracking-[-0.3px] text-text-h">{title}</h1>
    </div>
  );
}
