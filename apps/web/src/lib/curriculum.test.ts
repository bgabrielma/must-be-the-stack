import { describe, it, expect, vi, afterEach } from "vitest";
import { fetchJourneys, fetchJourney } from "./curriculum";
import { JsonApiParseError } from "../helpers/jsonApi";

describe("fetchJourneys", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("parses a valid journeys collection into camelCase Journey objects", async () => {
    stubFetchJson({
      data: [
        {
          id: "1",
          type: "journey",
          attributes: {
            title: "Leadership",
            description: null,
            status: "not_started",
            "subjects-count": 3,
            "completed-subjects-count": 0,
          },
        },
      ],
    });

    await expect(fetchJourneys()).resolves.toEqual([
      {
        id: "1",
        title: "Leadership",
        description: null,
        status: "not_started",
        subjectsCount: 3,
        completedSubjectsCount: 0,
      },
    ]);
  });

  it("throws JsonApiParseError when a required attribute is missing", async () => {
    stubFetchJson({
      data: [
        {
          id: "1",
          type: "journey",
          attributes: {
            title: "Leadership",
            description: null,
            "subjects-count": 3,
            "completed-subjects-count": 0,
          },
        },
      ],
    });

    await expect(fetchJourneys()).rejects.toBeInstanceOf(JsonApiParseError);
  });

  it("throws JsonApiParseError when an attribute has the wrong type", async () => {
    stubFetchJson({
      data: [
        {
          id: "1",
          type: "journey",
          attributes: {
            title: "Leadership",
            description: null,
            status: "not_started",
            "subjects-count": "three",
            "completed-subjects-count": 0,
          },
        },
      ],
    });

    await expect(fetchJourneys()).rejects.toBeInstanceOf(JsonApiParseError);
  });

  it("throws JsonApiParseError when the envelope itself is malformed", async () => {
    stubFetchJson({ nope: true });

    await expect(fetchJourneys()).rejects.toBeInstanceOf(JsonApiParseError);
  });
});

describe("fetchJourney", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("parses the journey and its included subjects", async () => {
    stubFetchJson({
      data: {
        id: "1",
        type: "journey",
        attributes: {
          title: "Leadership",
          description: null,
          status: "in_progress",
          "subjects-count": 1,
          "completed-subjects-count": 0,
        },
        relationships: {
          subjects: { data: [ { id: "10", type: "subject" } ] },
        },
      },
      included: [
        {
          id: "10",
          type: "subject",
          attributes: {
            title: "Foundations",
            position: 1,
            "minimum-passing-score": 7,
            status: "active",
            "lessons-count": 2,
            "completed-lessons-count": 0,
            "journey-title": "Leadership",
          },
        },
      ],
    });

    const journey = await fetchJourney("1");
    expect(journey.subjects).toEqual([
      {
        id: "10",
        title: "Foundations",
        position: 1,
        minimumPassingScore: 7,
        status: "active",
        lessonsCount: 2,
        completedLessonsCount: 0,
        journeyTitle: "Leadership",
      },
    ]);
  });

  it("throws JsonApiParseError when an included resource is missing a required attribute", async () => {
    stubFetchJson({
      data: {
        id: "1",
        type: "journey",
        attributes: {
          title: "Leadership",
          description: null,
          status: "in_progress",
          "subjects-count": 1,
          "completed-subjects-count": 0,
        },
        relationships: {
          subjects: { data: [ { id: "10", type: "subject" } ] },
        },
      },
      included: [
        {
          id: "10",
          type: "subject",
          attributes: {
            title: "Foundations",
            position: 1,
            "minimum-passing-score": 7,
            "lessons-count": 2,
            "completed-lessons-count": 0,
            "journey-title": "Leadership",
          },
        },
      ],
    });

    await expect(fetchJourney("1")).rejects.toBeInstanceOf(JsonApiParseError);
  });
});

function stubFetchJson(body: unknown) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({ ok: true, status: 200, json: async () => body })),
  );
}
