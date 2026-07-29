import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { BrandMark, EntryIllustration } from "../components/icons";
import { buttonClasses } from "../components/Button";
import { MutedLink } from "../components/MutedLink";

export const Route = createFileRoute("/")({
  component: Entry,
});

function Entry() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[100svh] flex-col px-5 pt-6 pb-5">
      <div className="mx-auto mb-3 flex flex-col items-center">
        <div className="mb-[0.625rem]">
          <BrandMark size="lg" />
        </div>
        <span className="font-heading text-[0.9375rem] font-bold text-text-h">must-be-the-stack</span>
      </div>
      <div className="mb-3 flex justify-center">
        <EntryIllustration />
      </div>
      <h1 className="my-2 text-center font-heading text-[1.4375rem] leading-[1.2] font-bold tracking-[-0.4px] text-text-h">
        {t("entry.title")}
      </h1>
      <p className="mb-6 text-center text-[0.78125rem]">{t("entry.subtitle")}</p>
      <div className="mt-auto pt-6">
        <Link
          to="/onboarding"
          className={buttonClasses({ variant: "primary", block: true })}
          data-testid="entry-start-journey"
        >
          {t("entry.startJourney")}
        </Link>
        <MutedLink to="/login">{t("entry.haveAccount")}</MutedLink>
      </div>
    </div>
  );
}
