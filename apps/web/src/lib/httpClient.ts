import { getAccessToken, setAccessToken } from "./accessToken";
import { ApiError } from "./ApiError";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function errorDetail(response: Response): Promise<string> {
  const body = await response.json().catch(() => null);
  return body?.errors?.[0]?.detail ?? response.statusText;
}

// Refreshes the access token using the refresh cookie. Returns whether it succeeded.
export async function refreshAccessToken(): Promise<boolean> {
  const response = await fetch(`${API_URL}/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    setAccessToken(null);
    return false;
  }

  const body = await response.json();
  setAccessToken(body.access_token);
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
