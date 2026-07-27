import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { requireAuth } from "../lib/routeGuards";
import { fetchJourneys, startJourney } from "../lib/curriculum";
import { UnitCard } from "../components/UnitCard";
import { CompassIcon, CheckIcon } from "../components/icons";
import { SearchField } from "../components/SearchField";
import { Button } from "../components/Button";

export const Route = createFileRoute("/home")({
  beforeLoad: requireAuth,
  component: Home,
});

const statusClasses = "flex min-h-[100svh] flex-col px-0 py-10 text-center";

function Home() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const { data: journeys, isPending, error } = useQuery({
    queryKey: [ "journeys" ],
    queryFn: fetchJourneys,
  });

  const startMutation = useMutation({
    mutationFn: startJourney,
    onSuccess: (journey) => {
      queryClient.invalidateQueries({ queryKey: [ "journeys" ] });
      navigate({ to: "/journeys/$journeyId", params: { journeyId: journey.id } });
    },
  });

  if (isPending) return <div className={statusClasses}>Loading...</div>;
  if (error) return <div className={statusClasses}>Could not reach the API.</div>;

  const inProgress = journeys.filter((journey) => journey.status === "in_progress");
  const notStarted = journeys.filter((journey) => journey.status === "not_started");
  const completed = journeys.filter((journey) => journey.status === "completed");

  if (inProgress.length > 0) {
    return (
      <div className="flex min-h-[100svh] flex-col px-5 pt-6 pb-5">
        <p className="mb-1 font-heading text-[11px] font-semibold tracking-[0.06em] text-accent uppercase">
          Welcome back
        </p>
        <h1 className="font-heading text-2xl leading-[1.15] font-bold tracking-[-0.3px] text-text-h">
          Continue your Journey
        </h1>
        <div className="my-4 flex flex-col gap-2">
          {inProgress.map((journey) => (
            <UnitCard
              key={journey.id}
              status="active"
              title={journey.title}
              meta={`${journey.completedSubjectsCount} of ${journey.subjectsCount} Subjects completed`}
              icon={<CompassIcon size={14} />}
              onClick={() => navigate({ to: "/journeys/$journeyId", params: { journeyId: journey.id } })}
            />
          ))}
        </div>
      </div>
    );
  }

  if (notStarted.length > 0) {
    const filtered = notStarted.filter((journey) =>
      journey.title.toLowerCase().includes(query.toLowerCase()),
    );

    return (
      <div className="flex min-h-[100svh] flex-col px-5 pt-6 pb-5">
        <p className="mb-1 font-heading text-[11px] font-semibold tracking-[0.06em] text-accent uppercase">
          Welcome
        </p>
        <h1 className="font-heading text-2xl leading-[1.15] font-bold tracking-[-0.3px] text-text-h">
          Start your first Journey
        </h1>
        <p className="mt-1.5 text-[13px]">Search or browse to begin.</p>
        <SearchField
          wrapperStyle={{ marginTop: "1rem" }}
          placeholder="Search Journeys"
          aria-label="Search Journeys"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="my-4 flex flex-col gap-2">
          {filtered.map((journey) => (
            <UnitCard
              key={journey.id}
              status="not_started"
              title={journey.title}
              meta={`${journey.subjectsCount} Subjects · Not started`}
              icon={<CompassIcon size={14} />}
              onClick={() => startMutation.mutate(journey.id)}
            />
          ))}
        </div>
      </div>
    );
  }

  if (completed.length > 0) {
    return (
      <div className="flex min-h-[100svh] flex-col px-5 pt-6 pb-5">
        <p className="mb-1 font-heading text-[11px] font-semibold tracking-[0.06em] text-accent uppercase">
          Welcome back
        </p>
        <h1 className="font-heading text-2xl leading-[1.15] font-bold tracking-[-0.3px] text-text-h">
          {completed[0].title} complete
        </h1>
        <div className="my-4 flex flex-col gap-2">
          {completed.map((journey) => (
            <UnitCard
              key={journey.id}
              status="completed"
              title={journey.title}
              meta={`Completed · ${journey.subjectsCount} of ${journey.subjectsCount} Subjects`}
              icon={<CheckIcon size={14} />}
            />
          ))}
        </div>
        <div className="mt-auto pt-6">
          <Button variant="secondary" block disabled>
            Browse other Journeys
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={statusClasses}>
      <p>No Journeys are available yet.</p>
    </div>
  );
}
