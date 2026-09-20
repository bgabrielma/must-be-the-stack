import { apiFetch, accessTokenResponseSchema } from "./httpClient";
import { setAccessToken } from "./accessToken";
import { setCurrentUser } from "./currentUser";
import { logParseIssues, JsonApiParseError } from "../helpers/jsonApi";

export async function signup(
  email: string,
  password: string,
  passwordConfirmation: string,
): Promise<void> {
  await apiFetch("/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, password_confirmation: passwordConfirmation }),
  });
}

export async function login(email: string, password: string): Promise<void> {
  const body = await apiFetch<unknown>("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  const result = accessTokenResponseSchema.safeParse(body);
  if (!result.success) {
    logParseIssues("login response", result.error);
    throw new JsonApiParseError("Malformed login response from the API");
  }

  // Whoever was signed in before is gone — the route gate must re-read the
  // Profile for the user who just logged in, not reuse the previous one's.
  setCurrentUser(null);
  setAccessToken(result.data.access_token);
}

export async function logout(): Promise<void> {
  await apiFetch("/logout", { method: "DELETE" });
  setCurrentUser(null);
  setAccessToken(null);
}
