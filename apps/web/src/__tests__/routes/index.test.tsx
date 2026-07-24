import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createRouter,
  createMemoryHistory,
} from "@tanstack/react-router";
import { routeTree } from "../../routeTree.gen";

function renderRouteTree() {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

describe("route tree", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: () =>
          Promise.resolve({
            data: [
              { id: "1", type: "pings", attributes: { message: "hello" } },
            ],
          }),
      }),
    );
  });

  it("renders the index route", async () => {
    renderRouteTree();

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "must-be-the-stack" }),
      ).toBeInTheDocument(),
    );

    await waitFor(() =>
      expect(screen.getByText("1 ping(s) from the API")).toBeInTheDocument(),
    );
  });
});
