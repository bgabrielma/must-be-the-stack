import { LockIcon } from "./icons";

interface LockTooltipProps {
  message: string;
}

export function LockTooltip({ message }: LockTooltipProps) {
  return (
    <div className="tooltip">
      <p className="tt-title">
        <LockIcon size={12} /> Locked
      </p>
      <p>{message}</p>
    </div>
  );
}
