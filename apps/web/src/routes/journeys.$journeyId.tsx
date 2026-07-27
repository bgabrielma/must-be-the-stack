import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { requireAuth } from "../lib/routeGuards";
import { fetchJourney, toPercent } from "../lib/curriculum";
import { UnitCard } from "../components/UnitCard";
import { LockTooltip } from "../components/LockTooltip";
import { PlayIcon } from "../components/icons";
import { lockStatusIcon, lockStatusMeta } from "../components/lockStatus";
import { PageHeading } from "../components/PageHeading";
import { STATUS_SCREEN_CLASSES } from "../lib/pageStyles";

export const Route = createFileRoute("/journeys/$journeyId")({
  beforeLoad: requireAuth,
  component: JourneyPage,
});

function JourneyPage() {
  const { journeyId } = Route.useParams();
  const navigate = useNavigate();
  const { data: journey, isPending, error } = useQuery({
    queryKey: [ "journey", journeyId ],
    queryFn: () => fetchJourney(journeyId),
  });

  if (isPending) return <div className={STATUS_SCREEN_CLASSES}>Loading...</div>;
  if (error) return <div className={STATUS_SCREEN_CLASSES}>Could not reach the API.</div>;

  const activeSubject = journey.subjects.find((subject) => subject.status === "active");

  return (
    <div className="flex min-h-[100svh] flex-col px-5 pt-6 pb-5">
      <PageHeading eyebrow="Journey" title={journey.title} />
      <p className="mt-1.5 text-[13px]">
        {journey.completedSubjectsCount} of {journey.subjectsCount} Subjects completed
      </p>
      <div className="my-4 flex flex-col gap-2">
        {journey.subjects.map((subject) => {
          const meta = lockStatusMeta(
            subject.status,
            `In progress · ${subject.completedLessonsCount}/${subject.lessonsCount} lessons`,
          );
          const icon = lockStatusIcon(subject.status, <PlayIcon size={14} />);

          return (
            <div key={subject.id}>
              {subject.status === "locked" && activeSubject && (
                <LockTooltip
                  message={`Finish all ${activeSubject.lessonsCount} lessons in ${activeSubject.title} and pass each exercise with ${toPercent(activeSubject.minimumPassingScore)}% or higher to unlock this Subject.`}
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
