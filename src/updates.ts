import { version as installedVersion } from '../package.json';

export const appVersion = installedVersion;
export const githubReleasesUrl = 'https://github.com/Reign-in-blood/Idual_app/releases';

const githubApi = 'https://api.github.com/repos/Reign-in-blood/Idual_app/releases?per_page=50';
const releasePrefix = 'https://github.com/Reign-in-blood/Idual_app/releases/tag/';
const downloadPrefix = 'https://github.com/Reign-in-blood/Idual_app/releases/download/';
const cacheKey = 'idual-github-releases-cache';
const checkIntervalMs = 24 * 60 * 60 * 1000;

export interface ReleaseInfo {
  version: string;
  tag: string;
  url: string;
  apkUrl: string;
}

function parseVersion(version: string): number[] | null {
  const match = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) return null;
  const parts = match.slice(1).map(Number);
  return parts.every(Number.isSafeInteger) ? parts : null;
}

export function compareVersions(a: string, b: string): number {
  const first = parseVersion(a);
  const second = parseVersion(b);
  if (!first || !second) return 0;
  for (let i = 0; i < 3; i++) {
    if (first[i] !== second[i]) return first[i] > second[i] ? 1 : -1;
  }
  return 0;
}

function validUrl(url: unknown, prefix: string): url is string {
  return typeof url === 'string' && url.startsWith(prefix);
}

function isReleaseInfo(value: unknown): value is ReleaseInfo {
  if (!value || typeof value !== 'object') return false;
  const v = value as Partial<ReleaseInfo>;
  return typeof v.version === 'string' && parseVersion(v.version) !== null
    && typeof v.tag === 'string' && validUrl(v.url, releasePrefix)
    && validUrl(v.apkUrl, downloadPrefix);
}

/** Accept published releases, including GitHub pre-releases; ignore releases without APK. */
export function selectNewestRelease(input: unknown): ReleaseInfo | null {
  if (!Array.isArray(input)) throw new Error('Invalid GitHub release response');
  let newest: ReleaseInfo | null = null;
  for (const entry of input) {
    if (!entry || typeof entry !== 'object') continue;
    const candidate = entry as Record<string, unknown>;
    if (candidate.draft === true || typeof candidate.tag_name !== 'string' || !Array.isArray(candidate.assets)) continue;
    const tag = candidate.tag_name;
    if (!parseVersion(tag) || !validUrl(candidate.html_url, releasePrefix)) continue;
    const asset = candidate.assets.find((value: unknown) => {
      if (!value || typeof value !== 'object') return false;
      const a = value as Record<string, unknown>;
      return typeof a.name === 'string' && a.name.toLowerCase().endsWith('.apk')
        && validUrl(a.browser_download_url, downloadPrefix)
        && (a.state === undefined || a.state === 'uploaded');
    }) as Record<string, unknown> | undefined;
    if (!asset) continue;
    const release: ReleaseInfo = {
      version: tag.replace(/^v/, ''),
      tag,
      url: candidate.html_url as string,
      apkUrl: asset.browser_download_url as string
    };
    if (!newest || compareVersions(release.version, newest.version) > 0) newest = release;
  }
  return newest;
}

function readCache(): { checkedAt: number; release: ReleaseInfo | null } | null {
  try {
    const raw = localStorage.getItem(cacheKey);
    if (!raw) return null;
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== 'object') return null;
    const candidate = data as { checkedAt?: unknown; release?: unknown };
    if (typeof candidate.checkedAt !== 'number' || !Number.isFinite(candidate.checkedAt)
      || candidate.checkedAt < 0 || candidate.checkedAt > Date.now()) return null;
    if (candidate.release !== null && !isReleaseInfo(candidate.release)) return null;
    return { checkedAt: candidate.checkedAt, release: candidate.release };
  } catch {
    return null;
  }
}

/** No background service: automatically checks on launch or return to foreground, once a day. */
export async function fetchNewestRelease(force = false): Promise<ReleaseInfo | null> {
  const cached = readCache();
  if (!force && cached && Date.now() - cached.checkedAt < checkIntervalMs) return cached.release;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);
  try {
    const response = await fetch(githubApi, { signal: controller.signal, cache: 'no-store' });
    if (!response.ok) throw new Error('GitHub returned HTTP ' + response.status);
    const release = selectNewestRelease(await response.json());
    localStorage.setItem(cacheKey, JSON.stringify({ checkedAt: Date.now(), release }));
    return release;
  } finally {
    clearTimeout(timeout);
  }
}
