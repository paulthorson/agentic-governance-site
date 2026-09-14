/**
 * Read-only pull of measured feeds from paulthorson/agentic-governance.
 * Site never publishes traction / improve / scars — AG is publisher-of-record.
 *
 * Prefer raw.githubusercontent.com when AG is public.
 * When AG is private, set AG_GITHUB_TOKEN (or GITHUB_TOKEN) so Contents API works.
 */

const DEFAULT_OWNER = 'paulthorson';
const DEFAULT_REPO = 'agentic-governance';
const DEFAULT_REF = 'main';

export function agOwner(): string {
  return process.env.AG_FEED_OWNER?.trim() || DEFAULT_OWNER;
}

export function agRepo(): string {
  return process.env.AG_FEED_REPO?.trim() || DEFAULT_REPO;
}

export function agRef(): string {
  return process.env.AG_FEED_REF?.trim() || DEFAULT_REF;
}

export function agGithubToken(): string | undefined {
  const token =
    process.env.AG_GITHUB_TOKEN?.trim() || process.env.GITHUB_TOKEN?.trim();
  return token || undefined;
}

function authHeaders(): HeadersInit {
  const token = agGithubToken();
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

/** Raw URL for a path under AG (public repos). */
export function agRawUrl(path: string): string {
  const clean = path.replace(/^\//, '');
  const overrideBase = process.env.AG_FEED_BASE?.trim();
  if (overrideBase) {
    return `${overrideBase.replace(/\/$/, '')}/${clean}`;
  }
  return `https://raw.githubusercontent.com/${agOwner()}/${agRepo()}/${agRef()}/${clean}`;
}

/** GitHub Contents API URL for a path under AG. */
export function agContentsUrl(path: string): string {
  const clean = path.replace(/^\//, '');
  return `https://api.github.com/repos/${agOwner()}/${agRepo()}/contents/${clean}?ref=${encodeURIComponent(agRef())}`;
}

const FETCH_INIT: RequestInit & {next?: {revalidate: number}} = {
  next: {revalidate: 300},
};

/**
 * Fetch text from AG. Tries raw URL first, then Contents API (raw accept) with token.
 * Returns null on any failure — callers hatch / hide (never invent).
 */
export async function fetchAgText(path: string): Promise<string | null> {
  const rawUrl =
    path === 'data/traction.json' && process.env.AG_TRACTION_URL?.trim()
      ? process.env.AG_TRACTION_URL.trim()
      : path === 'data/improve.json' && process.env.AG_IMPROVE_URL?.trim()
        ? process.env.AG_IMPROVE_URL.trim()
        : agRawUrl(path);

  try {
    const rawRes = await fetch(rawUrl, {
      ...FETCH_INIT,
      headers: {...authHeaders(), Accept: 'text/plain'},
    });
    if (rawRes.ok) return await rawRes.text();
  } catch {
    // fall through to API
  }

  try {
    const apiRes = await fetch(agContentsUrl(path), {
      ...FETCH_INIT,
      headers: {
        ...authHeaders(),
        Accept: 'application/vnd.github.raw+json',
      },
    });
    if (apiRes.ok) return await apiRes.text();
  } catch {
    return null;
  }

  return null;
}

export async function fetchAgJson<T>(path: string): Promise<T | null> {
  const text = await fetchAgText(path);
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export type AgDirEntry = {
  name: string;
  path: string;
  type: 'file' | 'dir' | string;
  download_url: string | null;
};

/** List a directory via GitHub Contents API (requires token when private). */
export async function listAgDir(path: string): Promise<AgDirEntry[] | null> {
  try {
    const res = await fetch(agContentsUrl(path), {
      ...FETCH_INIT,
      headers: {
        ...authHeaders(),
        Accept: 'application/vnd.github+json',
      },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as AgDirEntry[] | AgDirEntry;
    if (!Array.isArray(data)) return null;
    return data;
  } catch {
    return null;
  }
}
