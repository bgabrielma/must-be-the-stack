import { useTranslation } from "react-i18next";
import { LockIcon } from "./icons";

interface LockTooltipProps {
  message: string;
  testId?: string;
}

export function LockTooltip({ message, testId = "lock-tooltip" }: LockTooltipProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-2 rounded-lg bg-surface-inverse px-3 py-2 text-[0.71875rem] leading-[1.4] text-bg" data-testid={testId}>
      <p className="mb-0.5 flex items-center gap-1 font-bold">
        <LockIcon size={12} /> {t("lockTooltip.label")}
      </p>
      <p className="opacity-[0.82]">{message}</p>
    </div>
  );
}
