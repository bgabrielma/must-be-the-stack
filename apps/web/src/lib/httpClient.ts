import { z } from "zod";
import { getAccessToken, setAccessToken } from "./accessToken";
import { ApiError } from "./ApiError";
import { logParseIssues } from "../helpers/jsonApi";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const accessTokenResponseSchema = z.object({ access_token: z.string() });

async function errorDetail(response: Response): Promise<string> {
  const body = await response.json().catch(() => null);
  return body?.errors?.[0]?.detail ?? response.statusText;
}

// Refreshes the access token using the refresh cookie. Returns whether it succeeded.
// Runs at app boot for logged-out users too, so it must never throw/reject on a
// network failure or a malformed body — a failed refresh just means "not logged in".
export async function refreshAccessToken(): Promise<boolean> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/refresh`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    setAccessToken(null);
    return false;
  }

  if (!response.ok) {
    setAccessToken(null);
    return false;
  }

  const result = accessTokenResponseSchema.safeParse(await response.json().catch(() => null));
  if (!result.success) {
    logParseIssues("refresh response", result.error);
    setAccessToken(null);
    return false;
  }

  setAccessToken(result.data.access_token);
  return true;
}

async function request(
  path: string,
  options: RequestInit,
  allowRetry: boolean,
): Promise<Response> {
  const headers = new Headers(options.headers);
  const accessToken = getAccessToken();
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  if (options.body) headers.set("Content-Type", "application/json");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 401 && allowRetry && path !== "/refresh" && path !== "/login") {
    const refreshed = await refreshAccessToken();
    if (refreshed) return request(path, options, false);
  }

  return response;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await request(path, options, true);

  if (!response.ok) {
    throw new ApiError(response.status, await errorDetail(response));
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}
