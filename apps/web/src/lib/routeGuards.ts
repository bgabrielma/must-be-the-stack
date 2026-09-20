import { redirect } from "@tanstack/react-router";
import { getAccessToken } from "./accessToken";
import { loadCurrentUser } from "./currentUser";

// Shared `beforeLoad` guard for every authenticated route.
export function requireAuth() {
  if (!getAccessToken()) {
    throw redirect({ to: "/login" });
  }
}

// `beforeLoad` guard for every screen behind a complete Profile — Home, a
// Journey, a Subject, a Lesson (ADR-0015). Stacks on top of `requireAuth`;
// the profile screen itself uses `requireAuth` alone, or it would redirect
// to itself.
export async function requireCompleteProfile() {
  requireAuth();

  const user = await loadCurrentUser();
  if (user && !user.profileComplete) {
    throw redirect({ to: "/profile" });
  }
}

// Inverse of `requireAuth` — shared `beforeLoad` guard for every auth/entry
// route (login, signup, entry, onboarding), so an already-authenticated
// visitor can't land back on them via a direct URL or back-navigation.
export function requireGuest() {
  if (getAccessToken()) {
    throw redirect({ to: "/home" });
  }
}
