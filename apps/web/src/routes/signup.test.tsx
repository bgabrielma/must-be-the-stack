import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderRouteTree } from "../test/renderRoute";

describe("Signup route (/signup)", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if (url.endsWith("/signup")) {
          return {
            ok: true,
            status: 201,
            json: async () => ({ data: { id: "1", type: "users", attributes: {} } }),
          };
        }
        throw new Error(`Unexpected fetch: ${url}`);
      }),
    );
  });

  it("creates an account and redirects to login with a success banner", async () => {
    const user = userEvent.setup();
    renderRouteTree("/signup");

    await waitFor(() => screen.getByRole("heading", { name: "Create your account" }));

    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.type(screen.getByLabelText("Password"), "correct-horse-battery-staple");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Log in" })).toBeInTheDocument(),
    );
    expect(screen.getByText("Account created")).toBeInTheDocument();
  });

  it("shows an error when signup fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        status: 422,
        json: async () => ({ errors: [ { detail: "Email has already been taken" } ] }),
      })),
    );
    const user = userEvent.setup();
    renderRouteTree("/signup");

    await waitFor(() => screen.getByRole("heading", { name: "Create your account" }));
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.type(screen.getByLabelText("Password"), "pw");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() =>
      expect(screen.getByText("Email has already been taken")).toBeInTheDocument(),
    );
  });
});
