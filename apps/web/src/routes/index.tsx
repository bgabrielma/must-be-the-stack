import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { CompassIcon } from "../components/icons";
import { buttonClasses } from "../components/Button";
import { MutedLink } from "../components/MutedLink";

export const Route = createFileRoute("/")({
  component: Entry,
});

function Entry() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[100svh] flex-col px-5 pt-6 pb-5">
      <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white">
        <CompassIcon size={20} />
      </div>
      <h1 className="my-2 text-center font-heading text-[28px] leading-[1.2] font-bold tracking-[-0.4px] text-text-h">
        {t("entry.title")}
      </h1>
      <p className="mb-6 text-center text-sm">{t("entry.subtitle")}</p>
      <div className="mt-auto pt-6">
        <Link to="/onboarding" className={buttonClasses({ variant: "primary", block: true })}>
          {t("entry.startJourney")}
        </Link>
        <MutedLink to="/login">{t("entry.haveAccount")}</MutedLink>
      </div>
    </div>
  );
}
