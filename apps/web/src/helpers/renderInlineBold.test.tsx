import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderInlineBold } from "./renderInlineBold";

describe("renderInlineBold", () => {
  it("renders a `**bold**` span as <strong>, leaving the rest as plain text", () => {
    render(<p>{renderInlineBold("**Leader-follower:** writes go to a leader.")}</p>);

    const strong = screen.getByText("Leader-follower:");
    expect(strong.tagName).toBe("STRONG");
    expect(screen.getByText(/writes go to a leader\./)).toBeInTheDocument();
  });

  it("renders plain text unchanged when there's no bold marker", () => {
    render(<p>{renderInlineBold("No markup here.")}</p>);

    expect(screen.getByText("No markup here.")).toBeInTheDocument();
    expect(document.querySelector("strong")).not.toBeInTheDocument();
  });
});
