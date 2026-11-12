import "server-only";
import type { Locale } from "@/lib/i18n";

/**
 * UI strings per locale. Loaded on the server only, so translations never ship in the client bundle.
 * ar.json is the source of truth; en.json and fr.json must have the same keys (enforced by the type below).
 */
type ArDictionary = typeof import("@/content/dictionaries/ar.json");
export type Dictionary = ArDictionary;

/** The words the header and footer need — small enough to hand to client components (the 404 page). */
export type ChromeCopy = Pick<
  Dictionary,
  "a11y" | "site" | "nav" | "menu" | "theme" | "language" | "contact" | "footer"
>;

export const pickChrome = ({ a11y, site, nav, menu, theme, language, contact, footer }: Dictionary): ChromeCopy => ({
  a11y,
  site,
  nav,
  menu,
  theme,
  language,
  contact,
  footer,
});

// Every locale must match the Arabic shape — a missing or renamed key fails the type check.
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  ar: () => import("@/content/dictionaries/ar.json").then((m) => m.default),
  en: () => import("@/content/dictionaries/en.json").then((m) => m.default),
  fr: () => import("@/content/dictionaries/fr.json").then((m) => m.default),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => dictionaries[locale]();
