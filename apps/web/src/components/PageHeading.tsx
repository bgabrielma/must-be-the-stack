import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ChevronRightIcon } from "./icons";

interface PageHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  onBack?: () => void;
  testId?: string;
}

// `onBack` is only passed by routes nested under another screen (Journey,
// Subject, Lesson) — Home and the pre-auth screens have no parent screen to
// return to, so they render without it.
export function PageHeading({ eyebrow, title, onBack, testId = "page-heading" }: PageHeadingProps) {
  const { t } = useTranslation();

  return (
    <div data-testid={testId}>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label={t("pageHeading.back")}
          data-testid="back-button"
          className="mb-2 flex h-7 w-7 -translate-x-1.5 items-center justify-center rounded-full text-text-h"
        >
          <span className="inline-flex rotate-180">
            <ChevronRightIcon size={16} />
          </span>
        </button>
      )}
      {eyebrow && (
        <p className="mb-1 font-heading text-[0.6875rem] font-semibold tracking-[0.06em] text-accent uppercase">
          {eyebrow}
        </p>
      )}
      <h1 className="mb-[0.3125rem] font-heading text-[1.375rem] leading-[1.15] font-bold tracking-[-0.3px] text-text-h">
        {title}
      </h1>
    </div>
  );
}
