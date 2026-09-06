import { useTranslation } from "react-i18next";
import { LockIcon } from "./icons";

interface LockTooltipProps {
  message: string;
  testId?: string;
}

// Floats via `absolute bottom-full` — caller must wrap it and its card in a
// `relative` container. Always rendered, not hover-triggered: touch has no
// hover, and this keeps it in reading order for screen readers.
export function LockTooltip({ message, testId = "lock-tooltip" }: LockTooltipProps) {
  const { t } = useTranslation();

  return (
    <div
      className="absolute bottom-[calc(100%+0.5rem)] left-1/2 z-[5] w-max max-w-[232px] -translate-x-1/2 rounded-lg bg-surface-inverse px-3 py-2 text-left text-[0.71875rem] leading-[1.4] text-bg shadow-[0_8px_20px_-6px_rgba(0,0,0,0.25)]"
      data-testid={testId}
    >
      <p className="mb-0.5 flex items-center gap-1 font-bold">
        <LockIcon size={12} /> {t("lockTooltip.label")}
      </p>
      <p className="opacity-[0.82]">{message}</p>
      <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-[5px] border-transparent border-t-surface-inverse" />
    </div>
  );
}
