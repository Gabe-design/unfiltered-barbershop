// Single source of truth for the site's public origin — used for canonical/OG
// URLs, the sitemap, JSON-LD, and links inside emails.
//
// Resolution order:
//   1. NEXT_PUBLIC_BASE_URL  — set this once a custom domain is live
//   2. VERCEL_PROJECT_PRODUCTION_URL — provided by Vercel (e.g. my-site.vercel.app)
//   3. http://localhost:3000 — local development
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();
