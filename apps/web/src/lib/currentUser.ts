// The signed-in user, held in memory for the lifetime of the session — the
// same shape as `accessToken.ts`, and for the same reason: the route gate
// (`requireCompleteProfile`) runs on every guarded navigation and must not
// pay a round trip each time. Cleared on login so a second user in the same
// tab never inherits the first one's Profile, and refreshed on save.

import { fetchCurrentUser, type CurrentUser } from "./user";

let currentUser: CurrentUser | null = null;

export function setCurrentUser(user: CurrentUser | null) {
  currentUser = user;
}

// Returns null when the user can't be determined — an unreachable API, an
// expired session, a malformed body. Callers treat that as "unknown", never
// as "incomplete": a network blip must not trap someone on the profile
// screen with no way forward.
export async function loadCurrentUser(): Promise<CurrentUser | null> {
  if (currentUser) return currentUser;

  try {
    currentUser = await fetchCurrentUser();
  } catch {
    return null;
  }

  return currentUser;
}
