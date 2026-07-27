import { describe, it, expect, vi, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderRouteTree } from "../helpers/renderRoute";
import { setAccessToken } from "../../lib/api";

describe("Subject route (/subjects/:subjectId)", () => {
  afterEach(() => setAccessToken(null));

  it("renders Lessons with completed, active (unlocked), and locked states plus a lock tooltip", async () => {
    setAccessToken("test-token");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
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
              "lessons-count": 3,
              "completed-lessons-count": 1,
              "journey-title": "Software Design",
            },
            relationships: {
              lessons: {
                data: [
                  { id: "1", type: "lessons" },
                  { id: "2", type: "lessons" },
                  { id: "3", type: "lessons" },
                ],
              },
            },
          },
          included: [
            {
              id: "1",
              type: "lessons",
              attributes: { title: "What a Database Does", position: 1, status: "completed" },
            },
            {
              id: "2",
              type: "lessons",
              attributes: { title: "Replication & Failover", position: 2, status: "active" },
            },
            {
              id: "3",
              type: "lessons",
              attributes: { title: "Sharding Strategies", position: 3, status: "locked" },
            },
          ],
        }),
      })),
    );

    renderRouteTree("/subjects/2");

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Databases" })).toBeInTheDocument(),
    );

    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("Unlocked")).toBeInTheDocument();
    expect(screen.getAllByText("Locked").length).toBeGreaterThan(0);
    expect(
      screen.getByText('Pass the Exercise for "Replication & Failover" to unlock this Lesson.'),
    ).toBeInTheDocument();

    // Regression: the active Lesson's icon slot must render an icon, not the
    // bare position number (`lockStatusIcon` was once called with
    // `lesson.position` instead of a `PlayIcon` for the active case).
    const activeCard = screen.getByRole("button", { name: /Replication & Failover/ });
    expect(activeCard.querySelector(".icon svg")).toBeInTheDocument();
  });

  it("shows a not-available message when the Subject itself is locked", async () => {
    setAccessToken("test-token");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        status: 403,
        json: async () => ({ errors: [ { detail: "This Subject is locked" } ] }),
      })),
    );

    renderRouteTree("/subjects/3");

    await waitFor(() =>
      expect(
        screen.getByText("This Subject is locked, or could not be reached."),
      ).toBeInTheDocument(),
    );
  });
});
