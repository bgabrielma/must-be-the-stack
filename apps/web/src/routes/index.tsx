import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

interface PingsResponse {
  data: { id: string; type: string; attributes: { message: string } }[];
}

async function fetchPings(): Promise<PingsResponse> {
  const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
  const response = await fetch(`${apiUrl}/pings`);
  return response.json();
}

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { data, isPending, error } = useQuery({
    queryKey: ["pings"],
    queryFn: fetchPings,
  });

  return (
    <main>
      <h1>must-be-the-stack</h1>
      {isPending && <p>Loading...</p>}
      {error && <p>Could not reach the API.</p>}
      {data && <p>{data.data.length} ping(s) from the API</p>}
    </main>
  );
}
