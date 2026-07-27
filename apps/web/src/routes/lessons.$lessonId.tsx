import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { requireAuth } from "../lib/routeGuards";
import { fetchLesson } from "../lib/curriculum";
import { Button } from "../components/Button";

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

  if (isPending) return <div className="page status">Loading...</div>;
  if (error) return <div className="page status">This Lesson is locked, or could not be reached.</div>;

  return (
    <div className="page">
      <p className="crumb">
        {lesson.subjectTitle} · Lesson {lesson.position}
      </p>
      <h1 className="h1">{lesson.title}</h1>
      <div className="article">
        {lesson.content.split("\n\n").map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className="cta-row">
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
