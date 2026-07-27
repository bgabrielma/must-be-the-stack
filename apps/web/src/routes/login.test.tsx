import { describe, it, expect, vi, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderRouteTree } from "../test/renderRoute";
import { getAccessToken, setAccessToken } from "../lib/accessToken";

describe("Login route (/login)", () => {
  afterEach(() => setAccessToken(null));

  it("shows the account-created banner when arriving from signup", async () => {
    renderRouteTree("/login?created=true");

    await waitFor(() => expect(screen.getByText("Account created")).toBeInTheDocument());
  });

  it("logs in, stores the access token, and redirects to /home", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if (url.endsWith("/login")) {
          return { ok: true, status: 200, json: async () => ({ access_token: "test-token" }) };
        }
        if (url.endsWith("/journeys")) {
          return { ok: true, status: 200, json: async () => ({ data: [] }) };
        }
        throw new Error(`Unexpected fetch: ${url}`);
      }),
    );
    const user = userEvent.setup();
    renderRouteTree("/login");

    await waitFor(() => screen.getByRole("heading", { name: "Log in" }));
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.type(screen.getByLabelText("Password"), "correct-horse-battery-staple");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    await waitFor(() => expect(getAccessToken()).toBe("test-token"));
    await waitFor(() =>
      expect(screen.getByText("No Journeys are available yet.")).toBeInTheDocument(),
    );
  });

  it("shows an error on invalid credentials", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        status: 401,
        json: async () => ({ errors: [ { detail: "Invalid email or password" } ] }),
      })),
    );
    const user = userEvent.setup();
    renderRouteTree("/login");

    await waitFor(() => screen.getByRole("heading", { name: "Log in" }));
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.type(screen.getByLabelText("Password"), "wrong");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    await waitFor(() =>
      expect(screen.getByText("Invalid email or password")).toBeInTheDocument(),
    );
  });
});
