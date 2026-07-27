import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderRouteTree } from "../test/renderRoute";

describe("Onboarding route (/onboarding)", () => {
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
