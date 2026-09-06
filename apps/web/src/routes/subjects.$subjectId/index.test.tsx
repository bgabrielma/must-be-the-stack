import { describe, it, expect, vi, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderRouteTree } from "../../test/renderRoute";
import { setAccessToken } from "../../lib/accessToken";

describe("Subject route (/subjects/:subjectId)", () => {
  afterEach(() => setAccessToken(null));

  it("navigates back to the previous screen via the back button", async () => {
    setAccessToken("test-token");
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if (url.includes("/journeys/")) {
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
        }
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
      }),
    );
    const user = userEvent.setup();

    renderRouteTree([ "/journeys/1", "/subjects/2" ]);

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Databases" })).toBeInTheDocument(),
    );

    await user.click(screen.getByTestId("back-button"));

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Software Design" })).toBeInTheDocument(),
    );
  });

  it("renders Lessons with completed, active (unlocked), and locked states plus a lock tooltip", async () => {
    const user = userEvent.setup();
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
              attributes: { title: "What a Database Does", position: 1, status: "completed", score: 9 },
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

    expect(screen.getByText("Completed · 9/10")).toBeInTheDocument();
    expect(screen.getByText("Unlocked")).toBeInTheDocument();
    expect(screen.getAllByText("Locked").length).toBeGreaterThan(0);
    expect(
      screen.queryByText('Pass the Exercise for "Replication & Failover" to unlock this Lesson.'),
    ).not.toBeInTheDocument();

    await user.hover(screen.getByRole("button", { name: "Locked" }));

    expect(
      screen.getByText('Pass the Exercise for "Replication & Failover" to unlock this Lesson.'),
    ).toBeInTheDocument();

    const activeCard = screen.getByRole("button", { name: /Replication & Failover/ });
    expect(activeCard.querySelectorAll("svg").length).toBe(1);
    expect(screen.getByText("2", { selector: "span" })).toBeInTheDocument();
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
