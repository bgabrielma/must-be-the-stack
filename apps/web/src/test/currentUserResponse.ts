// The JSON:API body `GET /user` returns, for the fetch mocks in route tests.
// Every screen behind the profile gate fetches it via `beforeLoad`, so this
// is shared rather than re-spelled (with dasherized keys) in each test file.
export function currentUserResponse(attributes: Record<string, unknown> = {}) {
  return {
    data: {
      id: "1",
      type: "users",
      attributes: {
        email: "ada@example.com",
        "first-name": "Ada",
        "last-name": "Lovelace",
        "job-role": "Backend Engineer",
        about: "Learning system design one concept at a time.",
        "profile-complete": true,
        ...attributes,
      },
    },
  };
}
