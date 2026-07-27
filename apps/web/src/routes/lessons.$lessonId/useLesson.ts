import { useQuery } from "@tanstack/react-query";
import { fetchLesson, type LessonDetail } from "../../lib/curriculum";

export type LessonPageState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; lesson: LessonDetail };

export function useLesson(lessonId: string): LessonPageState {
  const { data: lesson, isPending, error } = useQuery({
    queryKey: [ "lesson", lessonId ],
    queryFn: () => fetchLesson(lessonId),
  });

  if (isPending) return { status: "loading" };
  if (error) return { status: "error" };

  return { status: "ready", lesson };
}
