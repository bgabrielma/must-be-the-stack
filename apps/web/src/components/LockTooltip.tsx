import { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LockIcon } from "./icons";

interface LockTooltipProps {
  message: string;
  testId?: string;
}

// Caller wraps this (and its card) in a `relative` container — the trigger
// sits at the card's right edge, and the panel floats via `absolute
// bottom-full` off the trigger, not the whole card, so it never reaches up
// into a heading above the list.
//
// Touch has no hover (ADR-0003), so hover is one of three ways to open this,
// not the only one: focus (keyboard tab) and a tap both open it too, a
// second tap toggles it closed, and a tap/click anywhere outside closes it —
// covering touch, keyboard, and screen-reader users alongside mouse hover.
export function LockTooltip({ message, testId = "lock-tooltip" }: LockTooltipProps) {
  const { t } = useTranslation();
  const [ open, setOpen ] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return undefined;

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [ open ]);

  return (
    <div
      ref={rootRef}
      className="absolute top-1/2 right-3 z-[5] -translate-y-1/2"
      data-testid={testId}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="flex h-6 w-6 items-center justify-center rounded-full text-text-muted"
        aria-expanded={open}
        aria-describedby={open ? panelId : undefined}
        aria-label={t("lockTooltip.label")}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
      >
        <LockIcon size={14} />
      </button>
      {open && (
        <div
          id={panelId}
          role="tooltip"
          className="absolute bottom-[calc(100%+0.5rem)] right-0 w-max max-w-[232px] rounded-lg bg-surface-inverse px-3 py-2 text-left text-[0.71875rem] leading-[1.4] text-bg shadow-[0_8px_20px_-6px_rgba(0,0,0,0.25)]"
        >
          <p className="mb-0.5 flex items-center gap-1 font-bold">
            <LockIcon size={12} /> {t("lockTooltip.label")}
          </p>
          <p className="opacity-[0.82]">{message}</p>
          <div className="absolute right-3 top-full h-0 w-0 border-[5px] border-transparent border-t-surface-inverse" />
        </div>
      )}
    </div>
  );
}
