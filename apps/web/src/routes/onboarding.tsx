import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { CompassIcon, PlayIcon, CheckIcon, BrandMark } from "../components/icons";
import { buttonClasses } from "../components/Button";
import { PageHeading } from "../components/PageHeading";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

function Onboarding() {
  const { t } = useTranslation();

  const steps = [
    {
      icon: <CompassIcon size={16} />,
      iconClassName: "bg-accent-bg text-accent",
      title: t("onboarding.pickJourneyTitle"),
      meta: t("onboarding.pickJourneyMeta"),
    },
    {
      icon: <PlayIcon size={16} />,
      iconClassName: "bg-accent-bg text-accent",
      title: t("onboarding.masterLessonTitle"),
      meta: t("onboarding.masterLessonMeta"),
    },
    {
      icon: <CheckIcon size={16} />,
      iconClassName: "bg-success-bg text-success",
      title: t("onboarding.passExerciseTitle"),
      meta: t("onboarding.passExerciseMeta"),
    },
  ];

  return (
    <div className="flex min-h-[100svh] flex-col px-5 pt-6 pb-5">
      <div className="mx-auto mt-2 mb-3 w-fit">
        <BrandMark size="md" />
      </div>
      <PageHeading eyebrow={t("onboarding.eyebrow")} title={t("onboarding.title")} />
      <p className="mb-3 text-xs">{t("onboarding.subtitle")}</p>
      <div className="mb-4 flex flex-col gap-2">
        {steps.map((step) => (
          <div
            key={step.title}
            className="flex w-full cursor-default items-center gap-3 rounded-card border border-border bg-bg px-4 py-3.5 text-left"
          >
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${step.iconClassName}`}>
              {step.icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className="mb-0.5 block font-heading text-sm font-semibold text-text-h">{step.title}</span>
              <span className="block text-xs text-text">{step.meta}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-6">
        <Link
          to="/signup"
          className={buttonClasses({ variant: "primary", block: true })}
          data-testid="onboarding-continue"
        >
          {t("onboarding.continue")}
        </Link>
      </div>
    </div>
  );
}
