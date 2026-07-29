import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useSubject } from "./useSubject";
import { requireAuth } from "../../lib/routeGuards";
import { toPercent } from "../../lib/curriculum";
import { UnitCard } from "../../components/UnitCard";
import { LockTooltip } from "../../components/LockTooltip";
import { InfoIcon, PlayIcon } from "../../components/icons";
import { lockStatusIcon, lockStatusMeta } from "../../components/lockStatus";
import { Badge } from "../../components/Badge";
import { Banner } from "../../components/Banner";
import { PageHeading } from "../../components/PageHeading";
import { StatusScreen } from "../../components/StatusScreen";

export const Route = createFileRoute("/subjects/$subjectId/")({
  beforeLoad: requireAuth,
  component: SubjectPage,
});

function SubjectPage() {
  const { t } = useTranslation();
  const { subjectId } = Route.useParams();
  const state = useSubject(subjectId);

  switch (state.status) {
    case "loading":
      return <StatusScreen>{t("subjectDetail.loading")}</StatusScreen>;

    case "error":
      return <StatusScreen>{t("subjectDetail.error")}</StatusScreen>;

    case "ready": {
      const { subject, activeLesson, onSelectLesson } = state;
      // Only the Lesson right after the active one needs the unlock explanation.
      const nextLockedLessonId = subject.lessons.find((lesson) => lesson.status === "locked")?.id;

      return (
        <div className="flex min-h-[100svh] flex-col px-5 pt-6 pb-5">
          <p className="mb-2 text-xs opacity-70">
            {t("subjectDetail.breadcrumb", { journeyTitle: subject.journeyTitle })}
          </p>
          <PageHeading title={subject.title} />
          <p className="mb-3">
            <Badge icon={<InfoIcon size={12} />}>
              {t("subjectDetail.minPassingScore", { score: toPercent(subject.minimumPassingScore) })}
            </Badge>
          </p>
          <Banner
            variant="info"
            icon={<InfoIcon size={18} />}
            title={t("subjectDetail.retakesAllowedTitle")}
            description={t("subjectDetail.retakesAllowedDescription")}
          />
          <div className="mb-4 flex flex-col gap-2">
            {subject.lessons.map((lesson) => {
              const meta = lockStatusMeta(lesson.status, t("subjectDetail.lessonMeta"));
              const icon = lockStatusIcon(lesson.status, <PlayIcon size={14} />);

              return (
                <div key={lesson.id}>
                  {lesson.id === nextLockedLessonId && activeLesson && (
                    <LockTooltip message={t("subjectDetail.lockMessage", { lesson: activeLesson.title })} />
                  )}
                  <UnitCard
                    status={lesson.status}
                    title={`${lesson.position}. ${lesson.title}`}
                    meta={meta}
                    icon={icon}
                    onClick={lesson.status === "locked" ? undefined : () => onSelectLesson(lesson)}
                    testId={`lesson-${lesson.id}`}
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
