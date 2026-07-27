// Access token lives in memory only (ADR-0007): it's lost on reload by design,
// and restored via a silent POST /refresh using the httpOnly refresh cookie
// the browser already holds. Never persist the access token to storage.

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

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

export async function signup(email: string, password: string): Promise<void> {
  await apiFetch("/signup", { method: "POST", body: JSON.stringify({ email, password }) });
}

export async function login(email: string, password: string): Promise<void> {
  const body = await apiFetch<{ access_token: string }>("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setAccessToken(body.access_token);
}

export async function logout(): Promise<void> {
  await apiFetch("/logout", { method: "DELETE" });
  setAccessToken(null);
}
