import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { requireAuth } from "../lib/routeGuards";
import { fetchJourneys, startJourney } from "../lib/curriculum";
import { UnitCard } from "../components/UnitCard";
import { CompassIcon, CheckIcon } from "../components/icons";
import { SearchField } from "../components/SearchField";
import { Button } from "../components/Button";
import { PageHeading } from "../components/PageHeading";
import { STATUS_SCREEN_CLASSES } from "../lib/pageStyles";

export const Route = createFileRoute("/home")({
  beforeLoad: requireAuth,
  component: Home,
});

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

  if (isPending) return <div className={STATUS_SCREEN_CLASSES}>Loading...</div>;
  if (error) return <div className={STATUS_SCREEN_CLASSES}>Could not reach the API.</div>;

  const inProgress = journeys.filter((journey) => journey.status === "in_progress");
  const notStarted = journeys.filter((journey) => journey.status === "not_started");
  const completed = journeys.filter((journey) => journey.status === "completed");

  if (inProgress.length > 0) {
    return (
      <div className="flex min-h-[100svh] flex-col px-5 pt-6 pb-5">
        <PageHeading eyebrow="Welcome back" title="Continue your Journey" />
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
        <PageHeading eyebrow="Welcome" title="Start your first Journey" />
        <p className="mt-1.5 text-[13px]">Search or browse to begin.</p>
        <SearchField
          wrapperClassName="mt-4"
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
        <PageHeading eyebrow="Welcome back" title={`${completed[0].title} complete`} />
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
    <div className={STATUS_SCREEN_CLASSES}>
      <p>No Journeys are available yet.</p>
    </div>
  );
}
