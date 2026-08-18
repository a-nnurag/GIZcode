// Owns the gated backend's base URL and session token — every other module talks to
// the API exclusively through apiFetch() (or getAuthHeader() for the pmtiles protocol,
// which issues its own raw fetches and can't go through apiFetch), so nothing else
// needs to know a token exists.
const API_BASE_VALUE = import.meta.env.VITE_API_BASE_URL as string | undefined;

if (!API_BASE_VALUE) {
  throw new Error('VITE_API_BASE_URL is not set — see apps/atlas/.env.example');
}

export const API_BASE = API_BASE_VALUE;

interface SessionResponse {
  token: string;
  expiresAt: number;
}

// Re-mint a little before the token's real expiry so an in-flight request never races
// the backend's own clock.
const REFRESH_MARGIN_MS = 10_000;

let sessionPromise: Promise<SessionResponse> | null = null;

async function mintSession(): Promise<SessionResponse> {
  const res = await fetch(`${API_BASE}/api/session`, { method: 'POST', cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to mint session token: ${res.status}`);
  return res.json() as Promise<SessionResponse>;
}

async function getToken(): Promise<string> {
  if (!sessionPromise) {
    sessionPromise = mintSession();
  } else {
    const current = await sessionPromise;
    if (current.expiresAt - REFRESH_MARGIN_MS <= Date.now()) {
      sessionPromise = mintSession();
    }
  }
  return (await sessionPromise).token;
}

// For callers that issue their own raw fetch()es instead of going through apiFetch —
// currently just the pmtiles protocol (src/lib/pmtilesProtocol.ts), which needs a
// live Authorization value to attach to its own Range requests.
export async function getAuthHeader(): Promise<string> {
  return `Bearer ${await getToken()}`;
}

// Wraps fetch() with the gated backend's base URL and auth header, and retries once
// with a freshly-minted token on a 401 (e.g. the token expired mid-session).
export async function apiFetch(path: string): Promise<Response> {
  const token = await getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (res.status !== 401) return res;

  sessionPromise = mintSession();
  const retryToken = await getToken();
  return fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${retryToken}` },
    cache: 'no-store',
  });
}
