import { describe, it, expect, vi, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderRouteTree } from "../../test/renderRoute";
import { setAccessToken } from "../../lib/accessToken";

describe("Home route (/home)", () => {
  afterEach(() => setAccessToken(null));

  it("redirects to /login when there is no access token", async () => {
    renderRouteTree("/home");

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Log in" })).toBeInTheDocument(),
    );
  });

  it("shows the browse/empty state when no Journey has been started", async () => {
    setAccessToken("test-token");
    mockJourneysResponse([
      {
        id: "1",
        type: "journeys",
        attributes: {
          title: "Software Design",
          description: null,
          status: "not_started",
          "subjects-count": 4,
          "completed-subjects-count": 0,
        },
      },
    ]);

    renderRouteTree("/home");

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Start your first Journey" })).toBeInTheDocument(),
    );
    expect(screen.getByText("4 Subjects · Not started")).toBeInTheDocument();
  });

  it("shows the in-progress state when a Journey has been started but not completed", async () => {
    setAccessToken("test-token");
    mockJourneysResponse([
      {
        id: "1",
        type: "journeys",
        attributes: {
          title: "Software Design",
          description: null,
          status: "in_progress",
          "subjects-count": 4,
          "completed-subjects-count": 1,
        },
      },
    ]);

    renderRouteTree("/home");

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Continue your Journey" })).toBeInTheDocument(),
    );
    expect(screen.getByText("1 of 4 Subjects completed")).toBeInTheDocument();
  });

  it("shows the completed state when every Journey is finished", async () => {
    setAccessToken("test-token");
    mockJourneysResponse([
      {
        id: "1",
        type: "journeys",
        attributes: {
          title: "Software Design",
          description: null,
          status: "completed",
          "subjects-count": 4,
          "completed-subjects-count": 4,
        },
      },
    ]);

    renderRouteTree("/home");

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Software Design complete" })).toBeInTheDocument(),
    );
  });
});

function mockJourneysResponse(journeys: unknown[]) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ data: journeys }),
    })),
  );
}
