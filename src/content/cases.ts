import { featuredWork, type WorkId } from "@/content/home";
import type { Locale } from "@/lib/i18n";

/**
 * Case studies (/work/[slug]). The slug of a case study is its project id. Words live in the dictionaries
 * (`case.items[id]`); this file holds what is not translated.
 *
 * Proof rule (handoff D-025): numbers only when verified with a source, quotes only with the client's written
 * consent. The demo projects have neither, so their "Results in numbers" and "In their words" blocks are not
 * shown. To add proof for a real project, fill `caseProof` — the blocks appear automatically.
 */
export type CaseMetric = { value: string; label: Record<Locale, string>; source: Record<Locale, string> };
export type CaseQuote = { text: Record<Locale, string>; name: string; role: Record<Locale, string> };

export const caseProof: Partial<Record<WorkId, { metrics?: CaseMetric[]; quote?: CaseQuote }>> = {};

/** Crops of the project image used by the gallery while real screenshots are missing (object-position). */
export const caseGalleryCrops = {
  key: "50% 50%",
  mobile: "62% 50%",
  mobileAlt: "20% 50%",
  detail: "80% 30%",
} as const;

export const caseSlugs = featuredWork.map((w) => w.id);

export const isCaseSlug = (value: string): value is WorkId => (caseSlugs as string[]).includes(value);

export const caseOf = (id: WorkId) => featuredWork.find((w) => w.id === id)!;

/** The next project in gallery order, looping back to the first. */
export const nextCase = (id: WorkId) => {
  const i = featuredWork.findIndex((w) => w.id === id);
  return featuredWork[(i + 1) % featuredWork.length];
};
