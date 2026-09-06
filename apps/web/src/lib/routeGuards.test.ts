import { describe, it, expect, afterEach } from "vitest";
import { requireAuth, requireGuest } from "./routeGuards";
import { setAccessToken } from "./accessToken";

describe("requireAuth", () => {
  afterEach(() => setAccessToken(null));

  it("redirects when there is no access token", () => {
    expect(() => requireAuth()).toThrow();
  });

  it("does not redirect when an access token is present", () => {
    setAccessToken("test-token");
    expect(() => requireAuth()).not.toThrow();
  });
});

describe("requireGuest", () => {
  afterEach(() => setAccessToken(null));

  it("redirects when an access token is present", () => {
    setAccessToken("test-token");
    expect(() => requireGuest()).toThrow();
  });

  it("does not redirect when there is no access token", () => {
    expect(() => requireGuest()).not.toThrow();
  });
});
