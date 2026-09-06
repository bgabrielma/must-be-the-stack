import { describe, it, expect, vi, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderRouteTree } from "../../test/renderRoute";
import { setAccessToken } from "../../lib/accessToken";

describe("Lesson route (/lessons/:lessonId)", () => {
  afterEach(() => setAccessToken(null));

  it("renders an unlocked Lesson's content", async () => {
    setAccessToken("test-token");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({
          data: {
            id: "2",
            type: "lessons",
            attributes: {
              title: "Replication & Failover",
              position: 2,
              status: "active",
              content: "Replication keeps copies of your data on multiple nodes.",
              "subject-title": "Databases",
            },
          },
        }),
      })),
    );

    renderRouteTree("/lessons/2");

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Replication & Failover" })).toBeInTheDocument(),
    );
    expect(
      screen.getByText("Replication keeps copies of your data on multiple nodes."),
    ).toBeInTheDocument();
    expect(screen.getByText("Databases · Lesson 2")).toBeInTheDocument();
  });

  it("renders a `**bold**` lead-in as <strong>", async () => {
    setAccessToken("test-token");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({
          data: {
            id: "2",
            type: "lessons",
            attributes: {
              title: "Replication & Failover",
              position: 2,
              status: "active",
              content: "**Leader-follower:** writes go to a leader, which streams changes to followers.",
              "subject-title": "Databases",
            },
          },
        }),
      })),
    );

    renderRouteTree("/lessons/2");

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Replication & Failover" })).toBeInTheDocument(),
    );
    const strong = screen.getByText("Leader-follower:");
    expect(strong.tagName).toBe("STRONG");
  });

  it("renders a completed Lesson's content for review", async () => {
    setAccessToken("test-token");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({
          data: {
            id: "1",
            type: "lessons",
            attributes: {
              title: "What a Database Does",
              position: 1,
              status: "completed",
              content: "A database's job is durable, concurrent, queryable storage.",
              "subject-title": "Databases",
            },
          },
        }),
      })),
    );

    renderRouteTree("/lessons/1");

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "What a Database Does" })).toBeInTheDocument(),
    );
    expect(
      screen.getByText("A database's job is durable, concurrent, queryable storage."),
    ).toBeInTheDocument();
  });

  it("shows a not-available message and withholds content for a locked Lesson", async () => {
    setAccessToken("test-token");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        status: 403,
        json: async () => ({ errors: [ { detail: "This Lesson is locked" } ] }),
      })),
    );

    renderRouteTree("/lessons/3");

    await waitFor(() =>
      expect(
        screen.getByText("This Lesson is locked, or could not be reached."),
      ).toBeInTheDocument(),
    );
  });
});
