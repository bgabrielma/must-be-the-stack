import { LockedStackMark } from "./LockedStackMark";

interface BrandMarkProps {
  size?: "md" | "lg";
}

// The accent-badge composition of LockedStackMark used in the Auth screen
// headers (Entry/Onboarding/Log in), per flows.html's `.hero-mark`. Kept
// separate from LockedStackMark itself so the bare mark stays reusable
// anywhere a badge isn't wanted.
const badgeClasses = {
  md: "h-10 w-10 rounded-xl",
  lg: "h-11 w-11 rounded-xl",
};

const markSize = {
  md: 20,
  lg: 22,
};

export function BrandMark({ size = "md" }: BrandMarkProps) {
  return (
    <div className={`flex items-center justify-center bg-accent text-white ${badgeClasses[size]}`}>
      <LockedStackMark size={markSize[size]} />
    </div>
  );
}
