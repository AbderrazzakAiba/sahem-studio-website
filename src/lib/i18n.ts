/**
 * Locales — Arabic is the default and is served without a prefix (/), English at /en, French at /fr.
 * Routing lives in src/proxy.ts; every page sits under src/app/[lang].
 */
export const locales = ["ar", "en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ar";

export const localeInfo: Record<Locale, { dir: "rtl" | "ltr"; name: string; short: string; hreflang: string }> = {
  ar: { dir: "rtl", name: "العربية", short: "ع", hreflang: "ar" },
  en: { dir: "ltr", name: "English", short: "EN", hreflang: "en" },
  fr: { dir: "ltr", name: "Français", short: "FR", hreflang: "fr" },
};

export const isLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);

/** Path without its locale prefix, from a browser pathname: "/fr/services" → "/services", "/services" → "/services". */
export function pathWithoutLocale(pathname: string): string {
  const first = pathname.split("/")[1] ?? "";
  if (isLocale(first)) return pathname.slice(first.length + 1) || "/";
  return pathname || "/";
}

/** Public URL for a path in a locale: ("/services", "ar") → "/services", ("/services", "fr") → "/fr/services". */
export function localizedPath(path: string, locale: Locale): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}
