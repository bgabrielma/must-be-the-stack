import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// @testing-library/react's automatic post-test cleanup only self-registers
// when it detects a global `afterEach` (i.e. vitest's `test.globals: true`).
// This project imports vitest's test APIs explicitly instead, so without this
// it never runs — DOM from earlier tests stacks up across `it` blocks.
afterEach(() => {
  cleanup();
});
