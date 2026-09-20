import { describe, it, expect, vi, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderRouteTree } from "../test/renderRoute";
import { mockApi } from "../test/mockApi";
import { setAccessToken } from "../lib/accessToken";

describe("Profile route (/profile)", () => {
  afterEach(() => setAccessToken(null));

  it("redirects to /login when there is no access token", async () => {
    renderRouteTree("/profile");

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Log in" })).toBeInTheDocument(),
    );
  });

  it("renders the capture form, marking only the required fields", async () => {
    setAccessToken("test-token");
    renderRouteTree("/profile");

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Tell us about you" })).toBeInTheDocument(),
    );

    expect(screen.getByLabelText(/^First name/)).toBeRequired();
    expect(screen.getByLabelText(/^Last name/)).toBeRequired();
    expect(screen.getByLabelText(/^Job role/)).toBeRequired();
    expect(screen.getByLabelText(/^About/)).not.toBeRequired();

    expect(screen.getByTestId("profile-first-name")).toHaveTextContent("First name*");
    expect(screen.getByTestId("profile-about")).not.toHaveTextContent("*");
  });

  it("saves the Profile and continues to Home", async () => {
    setAccessToken("test-token");
    const fetchMock = mockApi();
    const user = userEvent.setup();
    renderRouteTree("/profile");

    await waitFor(() => screen.getByRole("heading", { name: "Tell us about you" }));

    await user.type(screen.getByLabelText(/^First name/), "Ada");
    await user.type(screen.getByLabelText(/^Last name/), "Lovelace");
    await user.type(screen.getByLabelText(/^Job role/), "Backend Engineer");
    await user.click(screen.getByRole("button", { name: "Save and continue" }));

    await waitFor(() =>
      expect(screen.getByText("No Journeys are available yet.")).toBeInTheDocument(),
    );

    const saveCall = fetchMock.mock.calls.find(([ , options ]) => options?.method === "POST");
    expect(saveCall?.[0]).toMatch(/\/user$/);
    expect(JSON.parse(String(saveCall?.[1]?.body))).toEqual({
      first_name: "Ada",
      last_name: "Lovelace",
      job_role: "Backend Engineer",
      about: "",
    });
  });

  it("displays the API's validation error and stays on the screen", async () => {
    setAccessToken("test-token");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        status: 422,
        json: async () => ({ errors: [ { detail: "Last name can't be blank" } ] }),
      })),
    );
    const user = userEvent.setup();
    renderRouteTree("/profile");

    await waitFor(() => screen.getByRole("heading", { name: "Tell us about you" }));

    await user.type(screen.getByLabelText(/^First name/), "Ada");
    await user.type(screen.getByLabelText(/^Last name/), " ");
    await user.type(screen.getByLabelText(/^Job role/), "Backend Engineer");
    await user.click(screen.getByRole("button", { name: "Save and continue" }));

    await waitFor(() =>
      expect(screen.getByText("Last name can't be blank")).toBeInTheDocument(),
    );
    expect(screen.getByRole("heading", { name: "Tell us about you" })).toBeInTheDocument();
  });
});

describe("Profile gate", () => {
  afterEach(() => setAccessToken(null));

  it.each([
    [ "Home", "/home" ],
    [ "a Journey", "/journeys/1" ],
    [ "a Subject", "/subjects/1" ],
    [ "a Lesson", "/lessons/1" ],
  ])("sends a user with an incomplete Profile to /profile from %s", async (_name, path) => {
    setAccessToken("test-token");
    mockApi({ "first-name": null, "last-name": null, "job-role": null, "profile-complete": false });

    renderRouteTree(path);

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Tell us about you" })).toBeInTheDocument(),
    );
  });

  // ADR-0015: an unknown Profile state is not an incomplete one. Trapping
  // someone on the capture screen whose save request is equally unable to
  // reach the API would leave them no way forward at all.
  it("lets a user through when the Profile state cannot be determined", async () => {
    setAccessToken("test-token");
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if (url.endsWith("/user")) throw new TypeError("Failed to fetch");
        return { ok: true, status: 200, json: async () => ({ data: [] }) };
      }),
    );

    renderRouteTree("/home");

    await waitFor(() =>
      expect(screen.getByText("No Journeys are available yet.")).toBeInTheDocument(),
    );
  });

  it("lets a user with a complete Profile through to Home", async () => {
    setAccessToken("test-token");
    mockApi();

    renderRouteTree("/home");

    await waitFor(() =>
      expect(screen.getByText("No Journeys are available yet.")).toBeInTheDocument(),
    );
  });
});
