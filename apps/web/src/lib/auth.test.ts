import { describe, it, expect, vi, afterEach } from "vitest";
import { login } from "./auth";
import { getAccessToken, setAccessToken } from "./accessToken";
import { JsonApiParseError } from "../helpers/jsonApi";

describe("login", () => {
  afterEach(() => {
    setAccessToken(null);
    vi.unstubAllGlobals();
  });

  it("stores the access token when the login response is valid", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({ access_token: "fresh-token" }),
      })),
    );

    await login("person@example.com", "password");

    expect(getAccessToken()).toBe("fresh-token");
  });

  it("throws JsonApiParseError and does not store a token when the response is malformed", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({ access_token: 42 }),
      })),
    );

    await expect(login("person@example.com", "password")).rejects.toBeInstanceOf(
      JsonApiParseError,
    );
    expect(getAccessToken()).toBeNull();
  });
});
