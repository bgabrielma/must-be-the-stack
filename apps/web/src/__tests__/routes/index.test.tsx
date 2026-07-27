import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderRouteTree } from "../helpers/renderRoute";

describe("Entry route (/)", () => {
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
});
