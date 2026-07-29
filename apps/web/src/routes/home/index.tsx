import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useHome } from "./useHome";
import { requireAuth } from "../../lib/routeGuards";
import { UnitCard } from "../../components/UnitCard";
import { CompassIcon, CheckIcon } from "../../components/icons";
import { SearchField } from "../../components/SearchField";
import { Button } from "../../components/Button";
import { PageHeading } from "../../components/PageHeading";
import { StatusScreen } from "../../components/StatusScreen";

export const Route = createFileRoute("/home/")({
  beforeLoad: requireAuth,
  component: Home,
});

function Home() {
  const { t } = useTranslation();
  const state = useHome();

  switch (state.status) {
    case "loading":
      return <StatusScreen>{t("home.loading")}</StatusScreen>;

    case "error":
      return <StatusScreen>{t("home.error")}</StatusScreen>;

    case "in_progress":
      return (
        <div className="flex min-h-[100svh] flex-col px-5 pt-6 pb-5">
          <PageHeading eyebrow={t("home.inProgressEyebrow")} title={t("home.inProgressTitle")} />
          <div className="mb-4 flex flex-col gap-2">
            {state.journeys.map((journey) => (
              <UnitCard
                key={journey.id}
                status="active"
                title={journey.title}
                meta={t("home.inProgressMeta", {
                  completed: journey.completedSubjectsCount,
                  total: journey.subjectsCount,
                })}
                icon={<CompassIcon size={14} />}
                onClick={() => state.onSelect(journey)}
              />
            ))}
          </div>
        </div>
      );

    case "not_started":
      return (
        <div className="flex min-h-[100svh] flex-col px-5 pt-6 pb-5">
          <PageHeading eyebrow={t("home.notStartedEyebrow")} title={t("home.notStartedTitle")} />
          <p className="mb-3 text-xs">{t("home.notStartedSubtitle")}</p>
          <SearchField
            placeholder={t("home.searchPlaceholder")}
            aria-label={t("home.searchPlaceholder")}
            value={state.query}
            onChange={(event) => state.onQueryChange(event.target.value)}
          />
          <div className="mb-4 flex flex-col gap-2">
            {state.journeys.map((journey) => (
              <UnitCard
                key={journey.id}
                status="not_started"
                title={journey.title}
                meta={t("home.notStartedMeta", { count: journey.subjectsCount })}
                icon={<CompassIcon size={14} />}
                onClick={() => state.onStart(journey)}
              />
            ))}
          </div>
        </div>
      );

    case "completed":
      return (
        <div className="flex min-h-[100svh] flex-col px-5 pt-6 pb-5">
          <PageHeading
            eyebrow={t("home.completedEyebrow")}
            title={t("home.completedTitle", { title: state.journeys[0].title })}
          />
          <div className="mb-4 flex flex-col gap-2">
            {state.journeys.map((journey) => (
              <UnitCard
                key={journey.id}
                status="completed"
                title={journey.title}
                meta={t("home.completedMeta", { total: journey.subjectsCount })}
                icon={<CheckIcon size={14} />}
              />
            ))}
          </div>
          <div className="mt-auto pt-6">
            <Button variant="secondary" block disabled>
              {t("home.browseOthers")}
            </Button>
          </div>
        </div>
      );

    case "empty":
      return (
        <StatusScreen>
          <p>{t("home.empty")}</p>
        </StatusScreen>
      );
  }
}
