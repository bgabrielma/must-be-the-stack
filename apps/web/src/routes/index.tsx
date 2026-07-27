import { createFileRoute, Link } from "@tanstack/react-router";
import { CompassIcon } from "../components/icons";
import { buttonClasses } from "../components/Button";
import { LINK_MUTED_CLASSES } from "../lib/pageStyles";

export const Route = createFileRoute("/")({
  component: Entry,
});

function Entry() {
  return (
    <div className="flex min-h-[100svh] flex-col px-5 pt-6 pb-5">
      <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white">
        <CompassIcon size={20} />
      </div>
      <h1 className="my-2 text-center font-heading text-[28px] leading-[1.2] font-bold tracking-[-0.4px] text-text-h">
        Every step, earned.
      </h1>
      <p className="mb-6 text-center text-sm">No skipping ahead. No skipping the fun either.</p>
      <div className="mt-auto pt-6">
        <Link to="/onboarding" className={buttonClasses({ variant: "primary", block: true })}>
          Start your Journey
        </Link>
        <Link to="/login" className={LINK_MUTED_CLASSES}>
          Already have an account? Log in
        </Link>
      </div>
    </div>
  );
}
