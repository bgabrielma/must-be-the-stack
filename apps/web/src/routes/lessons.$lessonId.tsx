import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { requireAuth } from "../lib/routeGuards";
import { fetchLesson } from "../lib/curriculum";
import { Button } from "../components/Button";
import { PageHeading } from "../components/PageHeading";
import { StatusScreen } from "../components/StatusScreen";

export const Route = createFileRoute("/lessons/$lessonId")({
  beforeLoad: requireAuth,
  component: LessonPage,
});

function LessonPage() {
  const { t } = useTranslation();
  const { lessonId } = Route.useParams();
  const { data: lesson, isPending, error } = useQuery({
    queryKey: [ "lesson", lessonId ],
    queryFn: () => fetchLesson(lessonId),
  });

  if (isPending) return <StatusScreen>{t("lessonDetail.loading")}</StatusScreen>;
  if (error) return <StatusScreen>{t("lessonDetail.error")}</StatusScreen>;

  return (
    <div className="flex min-h-[100svh] flex-col px-5 pt-6 pb-5">
      <p className="mb-2 text-xs opacity-70">
        {t("lessonDetail.breadcrumb", { subjectTitle: lesson.subjectTitle, position: lesson.position })}
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
          {t("lessonDetail.askForHint")}
        </Button>
        <Button variant="primary" size="sm" className="flex-1" disabled>
          {t("lessonDetail.startExercise")}
        </Button>
      </div>
    </div>
  );
}
