import { z } from "zod";
import { apiFetch } from "./httpClient";
import {
  camelizeAttributes,
  findManyIncluded,
  logParseIssues,
  parseJsonApiDocument,
  JsonApiParseError,
  type JsonApiDocument,
  type JsonApiResource,
} from "../helpers/jsonApi";

export const journeyStatusSchema = z.enum(["not_started", "in_progress", "completed"]);
export type JourneyStatus = z.infer<typeof journeyStatusSchema>;

export const lockStatusSchema = z.enum(["locked", "active", "completed"]);
export type LockStatus = z.infer<typeof lockStatusSchema>;

const journeyAttributesSchema = z.object({
  title: z.string(),
  description: z.string().nullable(),
  status: journeyStatusSchema,
  subjectsCount: z.number(),
  completedSubjectsCount: z.number(),
});

const subjectAttributesSchema = z.object({
  title: z.string(),
  position: z.number(),
  minimumPassingScore: z.number(),
  status: lockStatusSchema,
  lessonsCount: z.number(),
  completedLessonsCount: z.number(),
  journeyTitle: z.string(),
});

const lessonAttributesSchema = z.object({
  title: z.string(),
  position: z.number(),
  status: lockStatusSchema,
  // The passing Submission's score (0-10), only present once the Lesson is
  // completed — see LessonSerializer#score. Absent or null otherwise.
  score: z.number().nullable().optional(),
});

const lessonDetailAttributesSchema = lessonAttributesSchema.extend({
  content: z.string(),
  subjectTitle: z.string(),
});

const journeySchema = journeyAttributesSchema.extend({ id: z.string() });
export type Journey = z.infer<typeof journeySchema>;

const subjectSchema = subjectAttributesSchema.extend({ id: z.string() });
export type Subject = z.infer<typeof subjectSchema>;

const lessonSchema = lessonAttributesSchema.extend({ id: z.string() });
export type Lesson = z.infer<typeof lessonSchema>;

export type JourneyDetail = Journey & { subjects: Subject[] };
export type SubjectDetail = Subject & { lessons: Lesson[] };

const lessonDetailSchema = lessonDetailAttributesSchema.extend({ id: z.string() });
export type LessonDetail = z.infer<typeof lessonDetailSchema>;

// Subject.minimumPassingScore (and a Submission's score) are on a 0-10 scale;
// screens display it as a percentage.
export function toPercent(scoreOutOfTen: number): number {
  return scoreOutOfTen * 10;
}

function toResource<Attributes>(
  resource: JsonApiResource,
  schema: z.ZodType<Attributes>,
): Attributes & { id: string } {
  const result = schema.safeParse(camelizeAttributes(resource.attributes));
  if (!result.success) {
    logParseIssues(`${resource.type} attributes`, result.error);
    throw new JsonApiParseError(`Malformed ${resource.type} payload from the API`);
  }
  return { id: resource.id, ...result.data };
}

function singleResource(document: JsonApiDocument): JsonApiResource {
  if (Array.isArray(document.data)) {
    throw new JsonApiParseError("Expected a single JSON:API resource, got a collection");
  }
  return document.data;
}

export async function fetchJourneys(): Promise<Journey[]> {
  const document = parseJsonApiDocument(await apiFetch<unknown>("/journeys"));
  const resources = Array.isArray(document.data) ? document.data : [ document.data ];
  return resources.map((resource) => toResource(resource, journeyAttributesSchema));
}

export async function startJourney(id: string): Promise<Journey> {
  const document = parseJsonApiDocument(
    await apiFetch<unknown>(`/journeys/${id}/start`, { method: "POST" }),
  );
  return toResource(singleResource(document), journeyAttributesSchema);
}

export async function fetchJourney(id: string): Promise<JourneyDetail> {
  const document = parseJsonApiDocument(await apiFetch<unknown>(`/journeys/${id}`));
  const resource = singleResource(document);
  const subjects = findManyIncluded(document, resource, "subjects")
    .map((included) => toResource(included, subjectAttributesSchema))
    .sort((a, b) => a.position - b.position);

  return { ...toResource(resource, journeyAttributesSchema), subjects };
}

export async function fetchSubject(id: string): Promise<SubjectDetail> {
  const document = parseJsonApiDocument(await apiFetch<unknown>(`/subjects/${id}`));
  const resource = singleResource(document);
  const lessons = findManyIncluded(document, resource, "lessons")
    .map((included) => toResource(included, lessonAttributesSchema))
    .sort((a, b) => a.position - b.position);

  return { ...toResource(resource, subjectAttributesSchema), lessons };
}

export async function fetchLesson(id: string): Promise<LessonDetail> {
  const document = parseJsonApiDocument(await apiFetch<unknown>(`/lessons/${id}`));
  return toResource(singleResource(document), lessonDetailAttributesSchema);
}
