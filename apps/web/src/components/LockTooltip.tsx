import { LockIcon } from "./icons";

interface LockTooltipProps {
  message: string;
}

export function LockTooltip({ message }: LockTooltipProps) {
  return (
    <div className="mb-2 rounded-lg bg-surface-inverse px-3 py-2 text-[11.5px] leading-[1.4] text-bg">
      <p className="mb-0.5 flex items-center gap-1 font-bold">
        <LockIcon size={12} /> Locked
      </p>
      <p className="opacity-90">{message}</p>
    </div>
  );
}
