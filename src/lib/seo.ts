import { caseSlugs } from "@/content/cases";
import { serviceSlugs } from "@/content/home";
import { defaultLocale, localeInfo, localizedPath, locales } from "@/lib/i18n";

/**
 * Public address of the site (canonical, hreflang, sitemap, structured data and social-card links). Order:
 *  1. NEXT_PUBLIC_SITE_URL — the real domain (https://sahemstudio.com on Vercel);
 *  2. VERCEL_PROJECT_PRODUCTION_URL — provided by Vercel at build time (also on preview builds, so previews
 *     point search engines to the production address, never to themselves);
 *  3. localhost for local development.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/+$/, "");

/** Absolute URL of a public path: "/en/services" → "https://sahemstudio.com/en/services". */
export const absoluteUrl = (path: string) => (path === "/" ? siteUrl : `${siteUrl}${path}`);

/**
 * hreflang links of a page (same path in every language) plus x-default, which tells search engines to show
 * the Arabic page to anyone whose language is not one of ours. Used by every page's metadata and the sitemap.
 */
export function languageAlternates(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(locales.map((l) => [localeInfo[l].hreflang, localizedPath(path, l)])),
    "x-default": localizedPath(path, defaultLocale),
  };
}

/**
 * Every page that should be found by search engines, without its locale prefix. Pages left out on purpose:
 * the thanks page (noindex) and the 404. Services and projects come from the content files, so a new one is
 * listed automatically.
 */
export const indexablePaths: string[] = [
  "/",
  "/services",
  ...serviceSlugs.map((s) => `/services/${s}`),
  "/work",
  ...caseSlugs.map((s) => `/work/${s}`),
  "/process",
  "/start",
  "/privacy",
];

/** Search engines may index only the live site; preview deployments and local builds are kept out. */
export const isProductionSite = process.env.VERCEL_ENV === "production";
