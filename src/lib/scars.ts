import {fetchAgJson, listAgDir, fetchAgText} from '@/lib/ag-feeds';

/**
 * Anonymized scar index for admin only.
 * Pulls read-only from AG (published JSON index preferred, else projects/<name>/scars/).
 * Never surfaces Studio PII, secrets, machine paths, or unpaid token/dollar figures.
 */

export type ScarIndexEntry = {
  project: string;
  filename: string;
  title: string;
  status: string;
  filed: string | null;
};

export type ScarIndex = {
  entries: ScarIndexEntry[];
  sourceNote: string;
};

type ScarJsonFeed = {
  entries?: ScarIndexEntry[];
  sourceNote?: string;
};

function parseScarMeta(
  project: string,
  filename: string,
  raw: string,
): ScarIndexEntry {
  const titleMatch = raw.match(/^#\s+(.+)$/m);
  const statusMatch = raw.match(/\*\*Status:\*\*\s*(.+)$/m);
  const filedMatch = raw.match(/\*\*Filed:\*\*\s*(.+)$/m);
  return {
    project,
    filename,
    title: titleMatch?.[1]?.trim() ?? filename,
    status: statusMatch?.[1]?.trim() ?? 'unknown',
    filed: filedMatch?.[1]?.trim() ?? null,
  };
}

async function loadFromJsonFeed(): Promise<ScarIndex | null> {
  const feed = await fetchAgJson<ScarJsonFeed>('data/scars.json');
  if (!feed) return null;
  return {
    entries: feed.entries ?? [],
    sourceNote:
      feed.sourceNote ??
      'Scar index pulled read-only from AG data/scars.json.',
  };
}

async function loadFromProjectsTree(): Promise<ScarIndex | null> {
  const projects = await listAgDir('projects');
  if (!projects) return null;

  const entries: ScarIndexEntry[] = [];
  for (const project of projects) {
    if (project.type !== 'dir') continue;
    const scars = await listAgDir(`projects/${project.name}/scars`);
    if (!scars) continue;
    for (const file of scars) {
      if (file.type !== 'file') continue;
      if (!file.name.endsWith('.md')) continue;
      if (file.name.toLowerCase() === 'readme.md') continue;
      const raw = await fetchAgText(`projects/${project.name}/scars/${file.name}`);
      if (!raw) continue;
      entries.push(parseScarMeta(project.name, file.name, raw));
    }
  }

  if (entries.length === 0) return null;

  entries.sort(
    (a, b) =>
      a.project.localeCompare(b.project) || a.filename.localeCompare(b.filename),
  );
  return {
    entries,
    sourceNote:
      'Anonymized scar SoT pulled read-only from AG projects/<name>/scars/. Titles and status only — no Studio PII.',
  };
}

export async function loadScarIndex(): Promise<ScarIndex> {
  const fromJson = await loadFromJsonFeed();
  if (fromJson) return fromJson;

  const fromTree = await loadFromProjectsTree();
  if (fromTree) return fromTree;

  return {
    entries: [],
    sourceNote:
      'Scar corpus stays on AG. Read-only pull found no data/scars.json and no projects/*/scars/ (set AG_GITHUB_TOKEN if AG is private).',
  };
}
