import { redirect } from "@tanstack/react-router";
import { getAccessToken } from "./accessToken";

// Shared `beforeLoad` guard for every authenticated route.
export function requireAuth() {
  if (!getAccessToken()) {
    throw redirect({ to: "/login" });
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
