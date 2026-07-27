import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { requireAuth } from "../lib/routeGuards";
import { fetchLesson } from "../lib/curriculum";
import { Button } from "../components/Button";
import { PageHeading } from "../components/PageHeading";
import { STATUS_SCREEN_CLASSES } from "../lib/pageStyles";

export const Route = createFileRoute("/lessons/$lessonId")({
  beforeLoad: requireAuth,
  component: LessonPage,
});

function LessonPage() {
  const { lessonId } = Route.useParams();
  const { data: lesson, isPending, error } = useQuery({
    queryKey: [ "lesson", lessonId ],
    queryFn: () => fetchLesson(lessonId),
  });

  if (isPending) return <div className={STATUS_SCREEN_CLASSES}>Loading...</div>;
  if (error) return <div className={STATUS_SCREEN_CLASSES}>This Lesson is locked, or could not be reached.</div>;

  return (
    <div className="flex min-h-[100svh] flex-col px-5 pt-6 pb-5">
      <p className="mb-2 text-xs opacity-70">
        {lesson.subjectTitle} · Lesson {lesson.position}
      </p>
      <PageHeading title={lesson.title} />
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
        <Button variant="primary" size="sm" className="flex-1" disabled>
          Start Exercise →
        </Button>
      </div>
    </div>
  );
}
