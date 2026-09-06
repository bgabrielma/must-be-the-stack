// Minimal JSON:API envelope helpers (ADR-0008). Backend controllers eager-load
// exactly the relationships each screen needs via an explicit `include:` param
// (ADR-0008's consequences call out arbitrary client-driven includes as an N+1
// risk), so these helpers only ever resolve `included` — they never request it.

import { z } from "zod";

export const jsonApiResourceIdentifierSchema = z.object({
  id: z.string(),
  type: z.string(),
});

const jsonApiRelationshipsSchema = z.record(
  z.string(),
  z.object({
    data: z.union([
      jsonApiResourceIdentifierSchema,
      z.array(jsonApiResourceIdentifierSchema),
      z.null(),
    ]),
  }),
).optional();

export const jsonApiResourceSchema = z.object({
  id: z.string(),
  type: z.string(),
  attributes: z.record(z.string(), z.unknown()),
  relationships: jsonApiRelationshipsSchema,
});

export const jsonApiDocumentSchema = z.object({
  data: z.union([jsonApiResourceSchema, z.array(jsonApiResourceSchema)]),
  included: z.array(jsonApiResourceSchema).optional(),
});

export type JsonApiResourceIdentifier = z.infer<typeof jsonApiResourceIdentifierSchema>;
export type JsonApiResource = z.infer<typeof jsonApiResourceSchema>;
export type JsonApiDocument = z.infer<typeof jsonApiDocumentSchema>;

export class JsonApiParseError extends Error {}

export function parseJsonApiDocument(payload: unknown): JsonApiDocument {
  const result = jsonApiDocumentSchema.safeParse(payload);
  if (!result.success) {
    logParseIssues("JSON:API envelope", result.error);
    throw new JsonApiParseError("Malformed API response envelope");
  }
  return result.data;
}

export function logParseIssues(label: string, error: z.ZodError): void {
  if (!import.meta.env.DEV) return;
  console.error(
    `[${label}] failed validation:`,
    error.issues.map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`),
  );
}

function camelize(key: string): string {
  return key.replace(/-([a-z0-9])/g, (_, char: string) => char.toUpperCase());
}

export function camelizeAttributes(attributes: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(attributes).map(([key, value]) => [camelize(key), value]),
  );
}

export function findIncluded(
  document: JsonApiDocument,
  ref: JsonApiResourceIdentifier | null | undefined,
): JsonApiResource | undefined {
  if (!ref) return undefined;
  return document.included?.find(
    (candidate) => candidate.id === ref.id && candidate.type === ref.type,
  );
}

export function findManyIncluded(
  document: JsonApiDocument,
  resource: JsonApiResource,
  relationshipName: string,
): JsonApiResource[] {
  const data = resource.relationships?.[relationshipName]?.data;
  const refs = Array.isArray(data) ? data : data ? [data] : [];
  return refs
    .map((ref) => findIncluded(document, ref))
    .filter((resolved): resolved is JsonApiResource => Boolean(resolved));
}
