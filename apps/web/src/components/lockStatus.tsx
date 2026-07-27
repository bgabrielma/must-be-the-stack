import type { ReactNode } from "react";
import { CheckIcon, LockIcon } from "./icons";
import type { LockStatus } from "../lib/curriculum";
import i18n from "../i18n";

// The locked/completed rendering is always the same across unit-card lists;
// only what an "active" item shows is specific to its screen. Not a
// component, so it reads the i18n instance directly rather than the
// `useTranslation` hook.
export function lockStatusIcon(status: LockStatus, activeIcon: ReactNode): ReactNode {
  if (status === "completed") return <CheckIcon size={14} />;
  if (status === "locked") return <LockIcon size={14} />;
  return activeIcon;
}

export function lockStatusMeta(status: LockStatus, activeMeta: string): string {
  if (status === "completed") return i18n.t("unitCard.completed");
  if (status === "locked") return i18n.t("unitCard.locked");
  return activeMeta;
}
