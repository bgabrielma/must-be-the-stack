import type { CSSProperties, InputHTMLAttributes } from "react";
import { SearchIcon } from "./icons";

interface SearchFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  wrapperStyle?: CSSProperties;
}

export function SearchField({ wrapperStyle, ...props }: SearchFieldProps) {
  return (
    <div className="search-field" style={wrapperStyle}>
      <SearchIcon size={15} />
      <input type="text" {...props} />
    </div>
  );
}
