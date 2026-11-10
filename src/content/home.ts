/**
 * Home page data that is not translated: order, slugs and links. The words live in the dictionaries
 * (`home.*`), keyed by these slugs, so adding a service or a project is one entry here + one per dictionary.
 */

/** The six services in the order of the handoff (01–06). The slug is also the page route /services/[slug]. */
export const serviceSlugs = ["websites", "landing-pages", "identity", "social", "automation", "motion"] as const;
export type ServiceSlug = (typeof serviceSlugs)[number];

export type WorkTag = "identity" | "website" | "landing" | "social" | "motion" | "automation";

/** Keys of the featured projects; their names, results and image descriptions live in the dictionaries. */
export type WorkId = "nakhla" | "basma" | "rimal" | "souf" | "zayn" | "nour";

/**
 * Selected work on the home page.
 * DEMO CONTENT for the manager's review: fictional brands with illustrative covers (public/work/*.svg) and
 * results written in words only (handoff D-025: no unverified numbers). Replace with the team's real projects
 * before launch. `slug` becomes the case-study route /work/[slug]; while it is null the card links to /work.
 */
export const featuredWork: { id: WorkId; slug: string | null; image: string; tags: WorkTag[] }[] = [
  { id: "nakhla", slug: null, image: "/work/nakhla.svg", tags: ["identity", "website"] },
  { id: "basma", slug: null, image: "/work/basma.svg", tags: ["landing"] },
  { id: "rimal", slug: null, image: "/work/rimal.svg", tags: ["social", "motion"] },
  { id: "souf", slug: null, image: "/work/souf.svg", tags: ["website"] },
  { id: "zayn", slug: null, image: "/work/zayn.svg", tags: ["automation"] },
  { id: "nour", slug: null, image: "/work/nour.svg", tags: ["motion"] },
];
