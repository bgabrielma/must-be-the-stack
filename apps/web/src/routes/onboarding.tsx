import { createFileRoute, Link } from "@tanstack/react-router";
import { CompassIcon, PlayIcon, CheckIcon } from "../components/icons";
import { buttonClasses } from "../components/Button";
import { PageHeading } from "../components/PageHeading";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

const steps = [
  { icon: <CompassIcon size={16} />, title: "Pick a Journey", meta: "Software Design, and more to come." },
  { icon: <PlayIcon size={16} />, title: "Master one Lesson", meta: "Bite-sized concepts, not videos." },
  { icon: <CheckIcon size={16} />, title: "Pass the Exercise", meta: "Prove it before the next one unlocks." },
];

function Onboarding() {
  return (
    <div className="flex min-h-[100svh] flex-col px-5 pt-6 pb-5">
      <PageHeading eyebrow="How it works" title="One concept at a time" />
      <p className="mt-1.5 text-[13px]">No skipping ahead — every step is earned.</p>
      <div className="my-4 flex flex-col gap-2">
        {steps.map((step) => (
          <div
            key={step.title}
            className="flex w-full cursor-default items-center gap-3 rounded-[10px] border border-border bg-bg px-4 py-3.5 text-left"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-muted text-text-muted">
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
        <Link to="/signup" className={buttonClasses({ variant: "primary", block: true })}>
          Continue
        </Link>
      </div>
    </div>
  );
}
