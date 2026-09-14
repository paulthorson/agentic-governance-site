/**
 * Admin allowlist for Gmail SSO.
 * Hardcoded operator + optional ADMIN_EMAILS env (comma-separated) override/extension.
 * Never invent additional operators from Studio or chat context.
 */

const HARDCODED_ADMIN_EMAILS = ["paul.thorson@gmail.com"] as const;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Parsed ADMIN_EMAILS env — empty/missing means use hardcoded only. */
export function envAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS;
  if (!raw || !raw.trim()) return [];
  return raw
    .split(",")
    .map((part) => normalizeEmail(part))
    .filter((email) => email.length > 0 && email.includes("@"));
}

/** Effective allowlist: hardcoded ∪ ADMIN_EMAILS. */
export function adminAllowlist(): string[] {
  const fromEnv = envAdminEmails();
  const set = new Set<string>([
    ...HARDCODED_ADMIN_EMAILS.map(normalizeEmail),
    ...fromEnv,
  ]);
  return [...set];
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminAllowlist().includes(normalizeEmail(email));
}

export const PRIMARY_ADMIN_EMAIL = HARDCODED_ADMIN_EMAILS[0];
