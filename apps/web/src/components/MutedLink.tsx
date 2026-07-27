import type { ComponentProps } from "react";
import { Link } from "@tanstack/react-router";

interface MutedLinkProps extends ComponentProps<typeof Link> {
  testId?: string;
}

// The small "Need an account? Sign up" / "Already have an account?" style of
// link shared by the auth screens.
export function MutedLink({ testId = "muted-link", ...props }: MutedLinkProps) {
  return (
    <Link
      className="mt-4 block text-center text-[13px] text-accent no-underline"
      data-testid={testId}
      {...props}
    />
  );
}
