import type { ReactNode } from "react";
import { ChevronRightIcon } from "./icons";

export type UnitCardStatus = "locked" | "active" | "completed" | "not_started";

interface UnitCardProps {
  status: UnitCardStatus;
  title: string;
  meta: string;
  icon: ReactNode;
  onClick?: () => void;
  testId?: string;
}

const base =
  "flex w-full items-center gap-3 rounded-card border border-border bg-bg px-4 py-3.5 text-left cursor-pointer disabled:cursor-not-allowed disabled:opacity-60";

const stateClasses: Record<UnitCardStatus, string> = {
  active: "border-accent-border bg-accent-bg",
  completed: "",
  locked: "",
  not_started: "",
};

const iconStateClasses: Record<UnitCardStatus, string> = {
  active: "bg-accent text-white",
  completed: "bg-success-bg text-success",
  locked: "bg-surface-muted text-text-muted",
  not_started: "bg-accent-bg text-accent",
};

const titleStateClasses: Record<UnitCardStatus, string> = {
  active: "text-text-h",
  completed: "text-text-h",
  locked: "text-text-muted",
  not_started: "text-text-h",
};

export function UnitCard({ status, title, meta, icon, onClick, testId = "unit-card" }: UnitCardProps) {
  return (
    <button
      type="button"
      className={`${base} ${stateClasses[status]}`}
      onClick={onClick}
      disabled={status === "locked"}
      data-testid={testId}
    >
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${iconStateClasses[status]}`}>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className={`mb-0.5 block font-heading text-sm font-semibold ${titleStateClasses[status]}`}>
          {title}
        </span>
        <span className="block text-xs text-text">{meta}</span>
      </span>
      {status !== "locked" && (
        <span className="text-text opacity-40">
          <ChevronRightIcon size={13} />
        </span>
      )}
    </button>
  );
}
