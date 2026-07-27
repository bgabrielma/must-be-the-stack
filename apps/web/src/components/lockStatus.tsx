import type { ReactNode } from "react";
import { CheckIcon, LockIcon } from "./icons";
import type { LockStatus } from "../lib/curriculum";

// The locked/completed rendering is always the same across unit-card lists;
// only what an "active" item shows is specific to its screen.
export function lockStatusIcon(status: LockStatus, activeIcon: ReactNode): ReactNode {
  if (status === "completed") return <CheckIcon size={14} />;
  if (status === "locked") return <LockIcon size={14} />;
  return activeIcon;
}

export function lockStatusMeta(status: LockStatus, activeMeta: string): string {
  if (status === "completed") return "Completed";
  if (status === "locked") return "Locked";
  return activeMeta;
}
