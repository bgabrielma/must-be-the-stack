import { describe, it, expect, vi, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderRouteTree } from "../helpers/renderRoute";
import { setAccessToken } from "../../lib/api";

describe("Journey route (/journeys/:journeyId)", () => {
  afterEach(() => setAccessToken(null));

  it("renders Subjects with completed, active, and locked lock states", async () => {
    setAccessToken("test-token");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({
          data: {
            id: "1",
            type: "journeys",
            attributes: {
              title: "Software Design",
              description: null,
              status: "in_progress",
              "subjects-count": 3,
              "completed-subjects-count": 1,
            },
            relationships: {
              subjects: {
                data: [
                  { id: "1", type: "subjects" },
                  { id: "2", type: "subjects" },
                  { id: "3", type: "subjects" },
                ],
              },
            },
          },
          included: [
            {
              id: "1",
              type: "subjects",
              attributes: {
                title: "Caching Fundamentals",
                position: 1,
                "minimum-passing-score": 8,
                status: "completed",
                "lessons-count": 2,
                "completed-lessons-count": 2,
                "journey-title": "Software Design",
              },
            },
            {
              id: "2",
              type: "subjects",
              attributes: {
                title: "Databases",
                position: 2,
                "minimum-passing-score": 8,
                status: "active",
                "lessons-count": 4,
                "completed-lessons-count": 2,
                "journey-title": "Software Design",
              },
            },
            {
              id: "3",
              type: "subjects",
              attributes: {
                title: "Distributed Systems",
                position: 3,
                "minimum-passing-score": 8,
                status: "locked",
                "lessons-count": 2,
                "completed-lessons-count": 0,
                "journey-title": "Software Design",
              },
            },
          ],
        }),
      })),
    );

    renderRouteTree("/journeys/1");

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Software Design" })).toBeInTheDocument(),
    );

    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("In progress · 2/4 lessons")).toBeInTheDocument();
    expect(screen.getAllByText("Locked").length).toBeGreaterThan(0);
    expect(
      screen.getByText(
        "Finish all 4 lessons in Databases and pass each exercise with 80% or higher to unlock this Subject.",
      ),
    ).toBeInTheDocument();
  });
});
