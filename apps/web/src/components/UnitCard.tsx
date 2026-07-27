import type { ReactNode } from "react";
import { ChevronRightIcon } from "./icons";

export type UnitCardStatus = "locked" | "active" | "completed" | "not_started";

interface UnitCardProps {
  status: UnitCardStatus;
  title: string;
  meta: string;
  icon: ReactNode;
  onClick?: () => void;
}

export function UnitCard({ status, title, meta, icon, onClick }: UnitCardProps) {
  const stateClass =
    status === "completed" ? "is-completed" : status === "active" ? "is-active" : status === "locked" ? "is-locked" : "";

  return (
    <button
      type="button"
      className={`unit-card ${stateClass}`.trim()}
      onClick={onClick}
      disabled={status === "locked"}
    >
      <span className="icon">{icon}</span>
      <span className="body">
        <span className="title">{title}</span>
        <span className="meta">{meta}</span>
      </span>
      {status !== "locked" && (
        <span className="chevron">
          <ChevronRightIcon size={13} />
        </span>
      )}
    </button>
  );
}
