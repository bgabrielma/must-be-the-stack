import { describe, it, expect, vi, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderRouteTree } from "../test/renderRoute";
import { setAccessToken } from "../lib/accessToken";

describe("Onboarding route (/onboarding)", () => {
  afterEach(() => setAccessToken(null));

  it("redirects an already-authenticated visitor to /home", async () => {
    setAccessToken("test-token");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ data: [] }) })),
    );

    renderRouteTree("/onboarding");

    await waitFor(() =>
      expect(screen.getByText("No Journeys are available yet.")).toBeInTheDocument(),
    );
  });

  it("shows the three how-it-works steps and continues to signup", async () => {
    const user = userEvent.setup();
    renderRouteTree("/onboarding");

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "One concept at a time" })).toBeInTheDocument(),
    );
    expect(screen.getByText("Pick a Journey")).toBeInTheDocument();
    expect(screen.getByText("Master one Lesson")).toBeInTheDocument();
    expect(screen.getByText("Pass the Exercise")).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Continue" }));

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Create your account" })).toBeInTheDocument(),
    );
  });
});
