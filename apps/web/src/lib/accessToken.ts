// Access token lives in memory only (ADR-0007): it's lost on reload by design,
// and restored via a silent POST /refresh using the httpOnly refresh cookie
// the browser already holds. Never persist the access token to storage.

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}
