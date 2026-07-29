import { apiFetch } from "./httpClient";
import { setAccessToken } from "./accessToken";

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
