import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { requireAuth } from "../lib/routeGuards";
import { fetchLesson } from "../lib/curriculum";
import { Button } from "../components/Button";

export const Route = createFileRoute("/lessons/$lessonId")({
  beforeLoad: requireAuth,
  component: LessonPage,
});

const statusClasses = "flex min-h-[100svh] flex-col px-0 py-10 text-center";

function LessonPage() {
  const { lessonId } = Route.useParams();
  const { data: lesson, isPending, error } = useQuery({
    queryKey: [ "lesson", lessonId ],
    queryFn: () => fetchLesson(lessonId),
  });

  if (isPending) return <div className={statusClasses}>Loading...</div>;
  if (error) return <div className={statusClasses}>This Lesson is locked, or could not be reached.</div>;

  return (
    <div className="flex min-h-[100svh] flex-col px-5 pt-6 pb-5">
      <p className="mb-2 text-xs opacity-70">
        {lesson.subjectTitle} · Lesson {lesson.position}
      </p>
      <h1 className="font-heading text-2xl leading-[1.15] font-bold tracking-[-0.3px] text-text-h">
        {lesson.title}
      </h1>
      <div className="text-sm leading-[1.6]">
        {lesson.content.split("\n\n").map((paragraph) => (
          <p key={paragraph} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>
      <div className="mt-auto flex gap-2 border-t border-border pt-4">
        <Button variant="secondary" size="sm" disabled>
          Ask for a hint
        </Button>
        <Button variant="primary" size="sm" style={{ flex: 1 }} disabled>
          Start Exercise →
        </Button>
      </div>
    </div>
  );
}
