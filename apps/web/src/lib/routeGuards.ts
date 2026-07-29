import { redirect } from "@tanstack/react-router";
import { getAccessToken } from "./accessToken";

// Shared `beforeLoad` guard for every authenticated route.
export function requireAuth() {
  if (!getAccessToken()) {
    throw redirect({ to: "/login" });
  }
}
