import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { requireAuth } from "../lib/routeGuards";
import { fetchJourneys, startJourney } from "../lib/curriculum";
import { UnitCard } from "../components/UnitCard";
import { CompassIcon, CheckIcon, SearchIcon } from "../components/icons";

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

  if (isPending) return <div className="page status">Loading...</div>;
  if (error) return <div className="page status">Could not reach the API.</div>;

  const inProgress = journeys.filter((journey) => journey.status === "in_progress");
  const notStarted = journeys.filter((journey) => journey.status === "not_started");
  const completed = journeys.filter((journey) => journey.status === "completed");

  if (inProgress.length > 0) {
    return (
      <div className="page">
        <p className="eyebrow">Welcome back</p>
        <h1 className="h1">Continue your Journey</h1>
        <div className="list">
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
      <div className="page">
        <p className="eyebrow">Welcome</p>
        <h1 className="h1">Start your first Journey</h1>
        <p className="sub">Search or browse to begin.</p>
        <div className="search-field" style={{ marginTop: "var(--space-4)" }}>
          <SearchIcon size={15} />
          <input
            type="text"
            placeholder="Search Journeys"
            aria-label="Search Journeys"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="list">
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
      <div className="page">
        <p className="eyebrow">Welcome back</p>
        <h1 className="h1">{completed[0].title} complete</h1>
        <div className="list">
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
        <div className="hero-cta">
          <button type="button" className="btn btn-secondary btn-block" disabled>
            Browse other Journeys
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page status">
      <p>No Journeys are available yet.</p>
    </div>
  );
}
