/**
 * Home page data that is not translated: order, slugs and links. The words live in the dictionaries
 * (`home.*`), keyed by these slugs, so adding a service or a project is one entry here + one per dictionary.
 */

/** The six services in the order of the handoff (01–06). The slug is also the page route /services/[slug]. */
export const serviceSlugs = ["websites", "landing-pages", "identity", "social", "automation", "motion"] as const;
export type ServiceSlug = (typeof serviceSlugs)[number];

export type WorkTag = "identity" | "website" | "landing" | "social" | "motion";

/**
 * Selected work on the home page. Placeholders until the team supplies real projects (handoff D-025:
 * no names, results or numbers without a source). `image` stays null until then; `slug` becomes the case-study
 * route /work/[slug] — while it is null the card links to /work.
 */
export const featuredWork: { slug: string | null; image: string | null; tags: WorkTag[] }[] = [
  { slug: null, image: null, tags: ["identity", "website"] },
  { slug: null, image: null, tags: ["landing"] },
  { slug: null, image: null, tags: ["social", "motion"] },
];
