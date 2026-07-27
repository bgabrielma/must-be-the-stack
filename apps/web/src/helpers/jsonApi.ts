// Minimal JSON:API envelope helpers (ADR-0008). Backend controllers eager-load
// exactly the relationships each screen needs via an explicit `include:` param
// (ADR-0008's consequences call out arbitrary client-driven includes as an N+1
// risk), so these helpers only ever resolve `included` — they never request it.

export interface JsonApiResourceIdentifier {
  id: string;
  type: string;
}

export interface JsonApiResource<Attributes = Record<string, unknown>> {
  id: string;
  type: string;
  attributes: Attributes;
  relationships?: Record<
    string,
    { data: JsonApiResourceIdentifier | JsonApiResourceIdentifier[] | null }
  >;
}

export interface JsonApiDocument<Attributes = Record<string, unknown>> {
  data: JsonApiResource<Attributes> | JsonApiResource<Attributes>[];
  included?: JsonApiResource[];
}

// Only ever needs `included`, so it's typed structurally rather than against
// the full generic JsonApiDocument<Attributes> — that generic doesn't vary
// covariantly against Record<string, unknown> for concrete Attributes shapes.
interface HasIncluded {
  included?: JsonApiResource[];
}

interface HasRelationships {
  relationships?: JsonApiResource["relationships"];
}

function camelize(key: string): string {
  return key.replace(/-([a-z0-9])/g, (_, char: string) => char.toUpperCase());
}

export function camelizeAttributes<T>(attributes: Record<string, unknown>): T {
  return Object.fromEntries(
    Object.entries(attributes).map(([key, value]) => [camelize(key), value]),
  ) as T;
}

export function findIncluded(
  document: HasIncluded,
  ref: JsonApiResourceIdentifier | null | undefined,
): JsonApiResource | undefined {
  if (!ref) return undefined;
  return document.included?.find(
    (candidate) => candidate.id === ref.id && candidate.type === ref.type,
  );
}

export function findManyIncluded(
  document: HasIncluded,
  resource: HasRelationships,
  relationshipName: string,
): JsonApiResource[] {
  const data = resource.relationships?.[relationshipName]?.data;
  const refs = Array.isArray(data) ? data : data ? [data] : [];
  return refs
    .map((ref) => findIncluded(document, ref))
    .filter((resolved): resolved is JsonApiResource => Boolean(resolved));
}
