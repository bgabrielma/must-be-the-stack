import { describe, it, expect, vi, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderRouteTree } from "../../test/renderRoute";
import { setAccessToken } from "../../lib/accessToken";

describe("Journey route (/journeys/:journeyId)", () => {
  afterEach(() => setAccessToken(null));

  it("navigates back to the previous screen via the back button", async () => {
    setAccessToken("test-token");
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if (url.endsWith("/journeys")) {
          return { ok: true, status: 200, json: async () => ({ data: [] }) };
        }
        return {
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
                "subjects-count": 0,
                "completed-subjects-count": 0,
              },
              relationships: { subjects: { data: [] } },
            },
            included: [],
          }),
        };
      }),
    );
    const user = userEvent.setup();

    renderRouteTree([ "/home", "/journeys/1" ]);

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Software Design" })).toBeInTheDocument(),
    );

    await user.click(screen.getByTestId("back-button"));

    await waitFor(() =>
      expect(screen.getByText("No Journeys are available yet.")).toBeInTheDocument(),
    );
  });

  it("renders Subjects with completed, active, and locked lock states", async () => {
    const user = userEvent.setup();
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

    const trigger = screen.getByRole("button", { name: "Locked" });
    expect(
      screen.queryByText(
        "Finish all 4 lessons in Databases and pass each exercise with 80% or higher to unlock this Subject.",
      ),
    ).not.toBeInTheDocument();

    await user.hover(trigger);

    expect(
      screen.getByText(
        "Finish all 4 lessons in Databases and pass each exercise with 80% or higher to unlock this Subject.",
      ),
    ).toBeInTheDocument();

    await user.unhover(trigger);

    expect(
      screen.queryByText(
        "Finish all 4 lessons in Databases and pass each exercise with 80% or higher to unlock this Subject.",
      ),
    ).not.toBeInTheDocument();
  });
});
