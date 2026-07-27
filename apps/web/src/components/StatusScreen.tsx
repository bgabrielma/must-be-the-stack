import type { ReactNode } from "react";

interface StatusScreenProps {
  children: ReactNode;
  testId?: string;
}

// Full-height centered wrapper for a route's loading/error/empty states.
export function StatusScreen({ children, testId = "status-screen" }: StatusScreenProps) {
  return (
    <div className="flex min-h-[100svh] flex-col px-0 py-10 text-center" data-testid={testId}>
      {children}
    </div>
  );
}
