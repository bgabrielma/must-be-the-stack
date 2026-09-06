import type { ReactNode } from "react";

// `**text**` -> <strong>text</strong>. Deliberately not a Markdown parser — see
// CONTRIBUTING.md's Lesson content markup note.
export function renderInlineBold(text: string): ReactNode[] {
  return text.split(/\*\*(.+?)\*\*/g).map((part, index) => (index % 2 === 1 ? <strong key={index}>{part}</strong> : part));
}
