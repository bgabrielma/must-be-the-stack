import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchJourney, type JourneyDetail, type Subject } from "../../lib/curriculum";

export type JourneyPageState =
  | { status: "loading" }
  | { status: "error" }
  | {
      status: "ready";
      journey: JourneyDetail;
      activeSubject: Subject | undefined;
      onSelectSubject: (subject: Subject) => void;
    };

export function useJourney(journeyId: string): JourneyPageState {
  const navigate = useNavigate();
  const { data: journey, isPending, error } = useQuery({
    queryKey: [ "journey", journeyId ],
    queryFn: () => fetchJourney(journeyId),
  });

  if (isPending) return { status: "loading" };
  if (error) return { status: "error" };

  return {
    status: "ready",
    journey,
    activeSubject: journey.subjects.find((subject) => subject.status === "active"),
    onSelectSubject: (subject) => navigate({ to: "/subjects/$subjectId", params: { subjectId: subject.id } }),
  };
}
