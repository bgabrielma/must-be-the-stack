import { z } from "zod";
import { apiFetch } from "./httpClient";
import { parseJsonApiDocument, singleResource, toResource } from "../helpers/jsonApi";

// Nullable rather than optional: a user who predates Profiles, or who
// abandoned the capture step, has all four fields unset (ADR-0015).
const currentUserAttributesSchema = z.object({
  email: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  jobRole: z.string().nullable(),
  about: z.string().nullable(),
  profileComplete: z.boolean(),
});

const currentUserSchema = currentUserAttributesSchema.extend({ id: z.string() });
export type CurrentUser = z.infer<typeof currentUserSchema>;

export interface ProfileInput {
  firstName: string;
  lastName: string;
  jobRole: string;
  about: string;
}

export async function fetchCurrentUser(): Promise<CurrentUser> {
  const document = parseJsonApiDocument(await apiFetch<unknown>("/user"));
  return toResource(singleResource(document), currentUserAttributesSchema);
}

export async function saveProfile(input: ProfileInput): Promise<CurrentUser> {
  const document = parseJsonApiDocument(
    await apiFetch<unknown>("/user", {
      method: "POST",
      body: JSON.stringify({
        first_name: input.firstName,
        last_name: input.lastName,
        job_role: input.jobRole,
        about: input.about,
      }),
    }),
  );

  return toResource(singleResource(document), currentUserAttributesSchema);
}
