import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { fetchJourneys, startJourney, type Journey } from "../../lib/curriculum";

export type HomeViewState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "in_progress"; journeys: Journey[]; onSelect: (journey: Journey) => void }
  | {
      status: "not_started";
      journeys: Journey[];
      query: string;
      onQueryChange: (query: string) => void;
      onStart: (journey: Journey) => void;
    }
  | { status: "completed"; journeys: Journey[] }
  | { status: "empty" };

export function useHome(): HomeViewState {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");

  const { data: journeys, isPending, error } = useQuery({
    queryKey: [ "journeys" ],
    queryFn: fetchJourneys,
  });

  const startMutation = useMutation({
    mutationFn: (journey: Journey) => startJourney(journey.id),
    onSuccess: (journey) => {
      queryClient.invalidateQueries({ queryKey: [ "journeys" ] });
      navigate({ to: "/journeys/$journeyId", params: { journeyId: journey.id } });
    },
  });

  const goToJourney = (journey: Journey) =>
    navigate({ to: "/journeys/$journeyId", params: { journeyId: journey.id } });

  if (isPending) return { status: "loading" };
  if (error) return { status: "error" };

  const inProgress = journeys.filter((journey) => journey.status === "in_progress");
  if (inProgress.length > 0) {
    return { status: "in_progress", journeys: inProgress, onSelect: goToJourney };
  }

  const notStarted = journeys.filter((journey) => journey.status === "not_started");
  if (notStarted.length > 0) {
    const filtered = notStarted.filter((journey) =>
      journey.title.toLowerCase().includes(query.toLowerCase()),
    );
    return {
      status: "not_started",
      journeys: filtered,
      query,
      onQueryChange: setQuery,
      onStart: (journey) => startMutation.mutate(journey),
    };
  }

  const completed = journeys.filter((journey) => journey.status === "completed");
  if (completed.length > 0) return { status: "completed", journeys: completed };

  return { status: "empty" };
}
