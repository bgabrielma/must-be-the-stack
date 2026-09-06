import { describe, it, expect, vi, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderRouteTree } from "../../test/renderRoute";
import { setAccessToken } from "../../lib/accessToken";

describe("Lesson route (/lessons/:lessonId)", () => {
  afterEach(() => setAccessToken(null));

  it("navigates back to the previous screen via the back button", async () => {
    setAccessToken("test-token");
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if (url.includes("/subjects/")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              data: {
                id: "2",
                type: "subjects",
                attributes: {
                  title: "Databases",
                  position: 2,
                  "minimum-passing-score": 8,
                  status: "active",
                  "lessons-count": 0,
                  "completed-lessons-count": 0,
                  "journey-title": "Software Design",
                },
                relationships: { lessons: { data: [] } },
              },
              included: [],
            }),
          };
        }
        return {
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
        };
      }),
    );
    const user = userEvent.setup();

    renderRouteTree([ "/subjects/2", "/lessons/2" ]);

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Replication & Failover" })).toBeInTheDocument(),
    );

    await user.click(screen.getByTestId("back-button"));

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Databases" })).toBeInTheDocument(),
    );
  });

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
