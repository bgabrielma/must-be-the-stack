import type { LockStatus } from "../lib/curriculum";

export function firstLockedId(items: { id: string; status: LockStatus }[]): string | undefined {
  return items.find((item) => item.status === "locked")?.id;
}
