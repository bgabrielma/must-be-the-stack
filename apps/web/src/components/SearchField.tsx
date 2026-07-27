import type { CSSProperties, InputHTMLAttributes } from "react";
import { SearchIcon } from "./icons";

interface SearchFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  wrapperStyle?: CSSProperties;
}

export function SearchField({ wrapperStyle, ...props }: SearchFieldProps) {
  return (
    <div className="relative mb-3" style={wrapperStyle}>
      <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-muted">
        <SearchIcon size={15} />
      </span>
      <input
        type="text"
        className="w-full rounded-lg border border-border bg-bg py-2.5 pr-3 pl-[34px] text-sm text-text-h focus:border-accent focus:ring-[3px] focus:ring-accent-bg focus:outline-none"
        {...props}
      />
    </div>
  );
}
