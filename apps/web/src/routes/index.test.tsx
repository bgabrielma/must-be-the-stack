import { describe, it, expect, afterEach, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderRouteTree } from "../test/renderRoute";
import { setAccessToken } from "../lib/accessToken";

describe("Entry route (/)", () => {
  afterEach(() => setAccessToken(null));

  it("renders the hero and both entry CTAs", async () => {
    renderRouteTree("/");

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Every step, earned." })).toBeInTheDocument(),
    );
    expect(screen.getByRole("link", { name: "Start your Journey" })).toHaveAttribute(
      "href",
      "/onboarding",
    );
    expect(screen.getByRole("link", { name: "Already have an account? Log in" })).toHaveAttribute(
      "href",
      "/login",
    );
  });

  it("redirects an already-authenticated visitor to /home", async () => {
    setAccessToken("test-token");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ data: [] }) })),
    );

    renderRouteTree("/");

    await waitFor(() =>
      expect(screen.getByText("No Journeys are available yet.")).toBeInTheDocument(),
    );
  });
});
