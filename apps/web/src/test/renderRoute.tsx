import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter, createMemoryHistory } from "@tanstack/react-router";
import { routeTree } from "../routeTree.gen";
import { setCurrentUser } from "../lib/currentUser";

// Route components call `useNavigate`/`Route.useParams`/`Route.useSearch`
// (from TanStack Router) and `useQuery`/`useMutation` (from TanStack Query),
// all of which throw outside their respective providers. Rendering a route
// with plain `@testing-library/react` `render()` isn't enough — it needs a
// real (in-memory) router and a query client above it, which is what this
// wraps up so every route test doesn't repeat this boilerplate.
export function renderRouteTree(initialEntries: string | string[]) {
  // `currentUser` is session-scoped module state that the profile gate reads
  // (see lib/currentUser.ts). Each rendered tree is a fresh session, so clear
  // it here rather than making every route test remember to.
  setCurrentUser(null);

  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: Array.isArray(initialEntries) ? initialEntries : [ initialEntries ],
    }),
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
