import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { requireAuth } from "../lib/routeGuards";
import { fetchSubject, toPercent } from "../lib/curriculum";
import { UnitCard } from "../components/UnitCard";
import { LockTooltip } from "../components/LockTooltip";
import { InfoIcon, PlayIcon } from "../components/icons";
import { lockStatusIcon, lockStatusMeta } from "../components/lockStatus";
import { Badge } from "../components/Badge";
import { Banner } from "../components/Banner";

export const Route = createFileRoute("/subjects/$subjectId")({
  beforeLoad: requireAuth,
  component: SubjectPage,
});

const statusClasses = "flex min-h-[100svh] flex-col px-0 py-10 text-center";

function SubjectPage() {
  const { subjectId } = Route.useParams();
  const navigate = useNavigate();
  const { data: subject, isPending, error } = useQuery({
    queryKey: [ "subject", subjectId ],
    queryFn: () => fetchSubject(subjectId),
  });

  if (isPending) return <div className={statusClasses}>Loading...</div>;
  if (error) return <div className={statusClasses}>This Subject is locked, or could not be reached.</div>;

  const activeLesson = subject.lessons.find((lesson) => lesson.status === "active");

  return (
    <div className="flex min-h-[100svh] flex-col px-5 pt-6 pb-5">
      <p className="mb-2 text-xs opacity-70">{subject.journeyTitle} · Subject</p>
      <h1 className="font-heading text-2xl leading-[1.15] font-bold tracking-[-0.3px] text-text-h">
        {subject.title}
      </h1>
      <p className="mt-1.5 mb-3 text-[13px]">
        <Badge icon={<InfoIcon size={12} />}>
          Min. passing score: {toPercent(subject.minimumPassingScore)}%
        </Badge>
      </p>
      <Banner
        variant="info"
        icon={<InfoIcon size={18} />}
        title="Retakes allowed"
        description="You can retry the exercise as many times as you need."
      />
      <div className="my-4 flex flex-col gap-2">
        {subject.lessons.map((lesson) => {
          const meta = lockStatusMeta(lesson.status, "Unlocked");
          const icon = lockStatusIcon(lesson.status, <PlayIcon size={14} />);

          return (
            <div key={lesson.id}>
              {lesson.status === "locked" && activeLesson && (
                <LockTooltip message={`Pass the Exercise for "${activeLesson.title}" to unlock this Lesson.`} />
              )}
              <UnitCard
                status={lesson.status}
                title={`${lesson.position}. ${lesson.title}`}
                meta={meta}
                icon={icon}
                onClick={
                  lesson.status === "locked"
                    ? undefined
                    : () => navigate({ to: "/lessons/$lessonId", params: { lessonId: lesson.id } })
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
