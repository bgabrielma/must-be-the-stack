import { describe, it, expect, vi, afterEach } from "vitest";
import { refreshAccessToken } from "./httpClient";
import { getAccessToken, setAccessToken } from "./accessToken";

describe("refreshAccessToken", () => {
  afterEach(() => {
    setAccessToken(null);
    vi.unstubAllGlobals();
  });

  it("resolves false and clears the access token when the network request fails", async () => {
    setAccessToken("stale-token");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("Failed to fetch");
      }),
    );

    await expect(refreshAccessToken()).resolves.toBe(false);
    expect(getAccessToken()).toBeNull();
  });

  it("resolves false when the refresh response is not ok", async () => {
    setAccessToken("stale-token");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: false, status: 401, json: async () => ({}) })),
    );

    await expect(refreshAccessToken()).resolves.toBe(false);
    expect(getAccessToken()).toBeNull();
  });

  it("resolves true and stores the access token when the refresh succeeds", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({ access_token: "fresh-token" }),
      })),
    );

    await expect(refreshAccessToken()).resolves.toBe(true);
    expect(getAccessToken()).toBe("fresh-token");
  });
});
