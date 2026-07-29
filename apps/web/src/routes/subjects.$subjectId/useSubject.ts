import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchSubject, type SubjectDetail, type Lesson } from "../../lib/curriculum";

export type SubjectPageState =
  | { status: "loading" }
  | { status: "error" }
  | {
      status: "ready";
      subject: SubjectDetail;
      activeLesson: Lesson | undefined;
      onSelectLesson: (lesson: Lesson) => void;
    };

export function useSubject(subjectId: string): SubjectPageState {
  const navigate = useNavigate();
  const { data: subject, isPending, error } = useQuery({
    queryKey: [ "subject", subjectId ],
    queryFn: () => fetchSubject(subjectId),
  });

  if (isPending) return { status: "loading" };
  if (error) return { status: "error" };

  return {
    status: "ready",
    subject,
    activeLesson: subject.lessons.find((lesson) => lesson.status === "active"),
    onSelectLesson: (lesson) => navigate({ to: "/lessons/$lessonId", params: { lessonId: lesson.id } }),
  };
}
