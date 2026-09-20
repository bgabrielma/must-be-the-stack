import { vi } from "vitest";
import { currentUserResponse } from "./currentUserResponse";

// Stubs `fetch` for a route test: answers the profile gate's `GET /user`
// (which runs in `beforeLoad` on every gated screen, before that screen's own
// queries) and an empty collection for anything else. Pass attribute
// overrides to describe a different user, e.g. an incomplete Profile.
export function mockApi(userAttributes: Record<string, unknown> = {}) {
  const fetchMock = vi.fn(async (url: string, _options?: RequestInit) =>
    url.endsWith("/user")
      ? { ok: true, status: 200, json: async () => currentUserResponse(userAttributes) }
      : { ok: true, status: 200, json: async () => ({ data: [] }) },
  );

  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}
