import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter, createMemoryHistory } from "@tanstack/react-router";
import { routeTree } from "../routeTree.gen";

// Route components call `useNavigate`/`Route.useParams`/`Route.useSearch`
// (from TanStack Router) and `useQuery`/`useMutation` (from TanStack Query),
// all of which throw outside their respective providers. Rendering a route
// with plain `@testing-library/react` `render()` isn't enough — it needs a
// real (in-memory) router and a query client above it, which is what this
// wraps up so every route test doesn't repeat this boilerplate.
export function renderRouteTree(initialEntry: string) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [ initialEntry ] }),
  });
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}
