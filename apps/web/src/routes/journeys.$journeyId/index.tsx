import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useJourney } from "./useJourney";
import { requireAuth } from "../../lib/routeGuards";
import { toPercent } from "../../lib/curriculum";
import { UnitCard } from "../../components/UnitCard";
import { LockTooltip } from "../../components/LockTooltip";
import { PlayIcon } from "../../components/icons";
import { lockStatusIcon, lockStatusMeta } from "../../components/lockStatus";
import { firstLockedId } from "../../helpers/curriculumGating";
import { PageHeading } from "../../components/PageHeading";
import { StatusScreen } from "../../components/StatusScreen";

export const Route = createFileRoute("/journeys/$journeyId/")({
  beforeLoad: requireAuth,
  component: JourneyPage,
});

function JourneyPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { journeyId } = Route.useParams();
  const state = useJourney(journeyId);

  switch (state.status) {
    case "loading":
      return <StatusScreen>{t("journeyDetail.loading")}</StatusScreen>;

    case "error":
      return <StatusScreen>{t("journeyDetail.error")}</StatusScreen>;

    case "ready": {
      const { journey, activeSubject, onSelectSubject } = state;
      const nextLockedSubjectId = firstLockedId(journey.subjects);

      return (
        <div className="flex min-h-[100svh] flex-col px-5 pt-6 pb-5">
          <PageHeading
            eyebrow={t("journeyDetail.eyebrow")}
            title={journey.title}
            onBack={() => router.history.back()}
          />
          <p className="mb-3 text-xs">
            {t("journeyDetail.subjectsCompleted", {
              completed: journey.completedSubjectsCount,
              total: journey.subjectsCount,
            })}
          </p>
          <div className="mb-4 flex flex-col gap-2">
            {journey.subjects.map((subject) => {
              const meta = lockStatusMeta(
                subject.status,
                t("journeyDetail.subjectMeta", {
                  completed: subject.completedLessonsCount,
                  total: subject.lessonsCount,
                }),
              );
              const icon = lockStatusIcon(subject.status, <PlayIcon size={14} />);

              return (
                <div key={subject.id} className="relative">
                  {subject.id === nextLockedSubjectId && activeSubject && (
                    <LockTooltip
                      message={t("journeyDetail.lockMessage", {
                        count: activeSubject.lessonsCount,
                        subject: activeSubject.title,
                        score: toPercent(activeSubject.minimumPassingScore),
                      })}
                    />
                  )}
                  <UnitCard
                    status={subject.status}
                    title={subject.title}
                    meta={meta}
                    icon={icon}
                    onClick={subject.status === "locked" ? undefined : () => onSelectSubject(subject)}
                    testId={`subject-${subject.id}`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  }
}
