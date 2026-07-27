import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { requireAuth } from "../lib/routeGuards";
import { fetchJourney, toPercent } from "../lib/curriculum";
import { UnitCard } from "../components/UnitCard";
import { LockTooltip } from "../components/LockTooltip";
import { PlayIcon } from "../components/icons";
import { lockStatusIcon, lockStatusMeta } from "../components/lockStatus";
import { PageHeading } from "../components/PageHeading";
import { StatusScreen } from "../components/StatusScreen";

export const Route = createFileRoute("/journeys/$journeyId")({
  beforeLoad: requireAuth,
  component: JourneyPage,
});

function JourneyPage() {
  const { t } = useTranslation();
  const { journeyId } = Route.useParams();
  const navigate = useNavigate();
  const { data: journey, isPending, error } = useQuery({
    queryKey: [ "journey", journeyId ],
    queryFn: () => fetchJourney(journeyId),
  });

  if (isPending) return <StatusScreen>{t("journeyDetail.loading")}</StatusScreen>;
  if (error) return <StatusScreen>{t("journeyDetail.error")}</StatusScreen>;

  const activeSubject = journey.subjects.find((subject) => subject.status === "active");

  return (
    <div className="flex min-h-[100svh] flex-col px-5 pt-6 pb-5">
      <PageHeading eyebrow={t("journeyDetail.eyebrow")} title={journey.title} />
      <p className="mt-1.5 text-[13px]">
        {t("journeyDetail.subjectsCompleted", {
          completed: journey.completedSubjectsCount,
          total: journey.subjectsCount,
        })}
      </p>
      <div className="my-4 flex flex-col gap-2">
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
            <div key={subject.id}>
              {subject.status === "locked" && activeSubject && (
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
                onClick={
                  subject.status === "locked"
                    ? undefined
                    : () => navigate({ to: "/subjects/$subjectId", params: { subjectId: subject.id } })
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
