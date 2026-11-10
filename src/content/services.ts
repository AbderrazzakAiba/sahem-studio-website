import { featuredWork, serviceSlugs, type ServiceSlug, type WorkId, type WorkTag } from "@/content/home";

/**
 * Per-service settings for the service pages (/services/[slug]). Words live in the dictionaries (`service.*`).
 *  - cover: the project whose image illustrates the service in the page hero (demo content for now).
 *  - workTag: projects carrying this tag appear under "Related work".
 */
export const serviceMeta: Record<ServiceSlug, { cover: WorkId; workTag: WorkTag }> = {
  websites: { cover: "souf", workTag: "website" },
  "landing-pages": { cover: "basma", workTag: "landing" },
  identity: { cover: "nakhla", workTag: "identity" },
  social: { cover: "rimal", workTag: "social" },
  automation: { cover: "zayn", workTag: "automation" },
  motion: { cover: "nour", workTag: "motion" },
};

export const isServiceSlug = (value: string): value is ServiceSlug =>
  (serviceSlugs as readonly string[]).includes(value);

/** Projects related to a service, in gallery order (at most two, as on the handoff screen). */
export const relatedWork = (slug: ServiceSlug) =>
  featuredWork.filter((w) => w.tags.includes(serviceMeta[slug].workTag)).slice(0, 2);

export const coverOf = (slug: ServiceSlug) => featuredWork.find((w) => w.id === serviceMeta[slug].cover)!;
