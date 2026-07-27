import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { requireAuth } from "../lib/routeGuards";
import { fetchSubject, toPercent } from "../lib/curriculum";
import { UnitCard } from "../components/UnitCard";
import { LockTooltip } from "../components/LockTooltip";
import { InfoIcon } from "../components/icons";
import { lockStatusIcon, lockStatusMeta } from "../components/lockStatus";
import { Badge } from "../components/Badge";
import { Banner } from "../components/Banner";

export const Route = createFileRoute("/subjects/$subjectId")({
  beforeLoad: requireAuth,
  component: SubjectPage,
});

function SubjectPage() {
  const { subjectId } = Route.useParams();
  const navigate = useNavigate();
  const { data: subject, isPending, error } = useQuery({
    queryKey: [ "subject", subjectId ],
    queryFn: () => fetchSubject(subjectId),
  });

  if (isPending) return <div className="page status">Loading...</div>;
  if (error) return <div className="page status">This Subject is locked, or could not be reached.</div>;

  const activeLesson = subject.lessons.find((lesson) => lesson.status === "active");

  return (
    <div className="page">
      <p className="crumb">{subject.journeyTitle} · Subject</p>
      <h1 className="h1">{subject.title}</h1>
      <p className="sub" style={{ marginBottom: "var(--space-3)" }}>
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
      <div className="list">
        {subject.lessons.map((lesson) => {
          const meta = lockStatusMeta(lesson.status, "Unlocked");
          const icon = lockStatusIcon(lesson.status, lesson.position);

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
