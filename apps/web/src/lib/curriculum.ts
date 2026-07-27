import { apiFetch } from "./httpClient";
import {
  camelizeAttributes,
  findManyIncluded,
  type JsonApiDocument,
  type JsonApiResource,
} from "../helpers/jsonApi";

export type JourneyStatus = "not_started" | "in_progress" | "completed";
export type LockStatus = "locked" | "active" | "completed";

interface JourneyAttributes {
  title: string;
  description: string | null;
  status: JourneyStatus;
  subjectsCount: number;
  completedSubjectsCount: number;
}

interface SubjectAttributes {
  title: string;
  position: number;
  minimumPassingScore: number;
  status: LockStatus;
  lessonsCount: number;
  completedLessonsCount: number;
  journeyTitle: string;
}

interface LessonAttributes {
  title: string;
  position: number;
  status: LockStatus;
}

interface LessonDetailAttributes extends LessonAttributes {
  content: string;
  subjectTitle: string;
}

export interface Journey extends JourneyAttributes {
  id: string;
}

export interface Subject extends SubjectAttributes {
  id: string;
}

export interface Lesson extends LessonAttributes {
  id: string;
}

export interface JourneyDetail extends Journey {
  subjects: Subject[];
}

export interface SubjectDetail extends Subject {
  lessons: Lesson[];
}

export interface LessonDetail extends LessonDetailAttributes {
  id: string;
}

// Subject.minimumPassingScore (and a Submission's score) are on a 0-10 scale;
// screens display it as a percentage.
export function toPercent(scoreOutOfTen: number): number {
  return scoreOutOfTen * 10;
}

// `resource.attributes` is deliberately typed as `unknown` here rather than
// `T`: JSON:API attribute payloads are only known-shaped by our own say-so
// (they're parsed network JSON), and TS won't structurally assign a concrete
// interface to/from a generic bag without an index signature. This is the one
// place that trust is asserted, via `camelizeAttributes`'s internal cast.
function toResource<T>(resource: { id: string; attributes: unknown }): T & { id: string } {
  return { id: resource.id, ...camelizeAttributes<T>(resource.attributes as Record<string, unknown>) };
}

export async function fetchJourneys(): Promise<Journey[]> {
  const document = await apiFetch<JsonApiDocument<JourneyAttributes>>("/journeys");
  const resources = Array.isArray(document.data) ? document.data : [ document.data ];
  return resources.map((resource) => toResource<JourneyAttributes>(resource));
}

export async function startJourney(id: string): Promise<Journey> {
  const document = await apiFetch<JsonApiDocument<JourneyAttributes>>(`/journeys/${id}/start`, {
    method: "POST",
  });
  return toResource<JourneyAttributes>(document.data as JsonApiResource<JourneyAttributes>);
}

export async function fetchJourney(id: string): Promise<JourneyDetail> {
  const document = await apiFetch<JsonApiDocument<JourneyAttributes>>(`/journeys/${id}`);
  const resource = document.data as JsonApiResource<JourneyAttributes>;
  const subjects = findManyIncluded(document, resource, "subjects")
    .map((included) => toResource<SubjectAttributes>(included))
    .sort((a, b) => a.position - b.position);

  return { ...toResource<JourneyAttributes>(resource), subjects };
}

export async function fetchSubject(id: string): Promise<SubjectDetail> {
  const document = await apiFetch<JsonApiDocument<SubjectAttributes>>(`/subjects/${id}`);
  const resource = document.data as JsonApiResource<SubjectAttributes>;
  const lessons = findManyIncluded(document, resource, "lessons")
    .map((included) => toResource<LessonAttributes>(included))
    .sort((a, b) => a.position - b.position);

  return { ...toResource<SubjectAttributes>(resource), lessons };
}

export async function fetchLesson(id: string): Promise<LessonDetail> {
  const document = await apiFetch<JsonApiDocument<LessonDetailAttributes>>(`/lessons/${id}`);
  return toResource<LessonDetailAttributes>(document.data as JsonApiResource<LessonDetailAttributes>);
}
