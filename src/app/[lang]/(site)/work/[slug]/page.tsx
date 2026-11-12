import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CaseChapter,
  CaseCover,
  CaseGallery,
  CaseHero,
  CaseQuoteBlock,
  CaseResult,
  NextProject,
} from "@/components/case/CaseSections";
import { FinalCta } from "@/components/sections/FinalCta";
import { Tag } from "@/components/ui/Tag";
import { caseGalleryCrops, caseOf, caseProof, caseSlugs, isCaseSlug, nextCase } from "@/content/cases";
import { site, startHref, whatsappHref } from "@/content/site";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localeInfo, localizedPath, locales } from "@/lib/i18n";

/** One case study per project, for every locale (the [lang] params come from the root layout). */
export function generateStaticParams() {
  return caseSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/work/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang) || !isCaseSlug(slug)) return {};
  const t = await getDictionary(lang);
  const path = `/work/${slug}`;
  return {
    title: t.home.work.items[slug].client,
    description: t.case.items[slug].lead,
    alternates: {
      canonical: localizedPath(path, lang),
      languages: Object.fromEntries(locales.map((l) => [localeInfo[l].hreflang, localizedPath(path, l)])),
    },
  };
}

/**
 * Case study template (handoff: case-desktop / tablet / mobile): three stops on the line — starting point →
 * the route → the goal (Ink) — then proof (only when real), the next project and the final call to action.
 * Demo content until the team supplies real projects.
 */
export default async function CasePage({ params }: PageProps<"/[lang]/work/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang) || !isCaseSlug(slug)) notFound();
  const t = await getDictionary(lang);
  const L = t.case.labels;
  const c = t.case.items[slug];
  const work = caseOf(slug);
  const card = t.home.work.items[slug];
  const next = nextCase(slug);
  const proof = caseProof[slug];
  const number = String(caseSlugs.indexOf(slug) + 1).padStart(2, "0");
  const tags = work.tags.map((tag) => t.home.work.tags[tag]);
  const alt = (label: string) => `${card.client} — ${label}`;

  return (
    <main id="main">
      <CaseHero
        breadcrumb={{
          label: t.a11y.breadcrumb,
          items: [
            { label: t.nav.home, href: localizedPath("/", lang) },
            { label: t.nav.work, href: localizedPath("/work", lang) },
            { label: card.client },
          ],
        }}
        eyebrow={
          L.latinPrefix
            ? { label: L.eyebrow, latin: `${L.latinPrefix} ${number}` }
            : { label: `${L.eyebrow} ${number}`, latin: "" }
        }
        title={c.title}
        lead={c.lead}
        facts={[
          { label: L.facts.client, value: card.client },
          { label: L.facts.sector, value: c.sector },
          {
            label: L.facts.services,
            value: (
              <span className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </span>
            ),
          },
          {
            label: L.facts.year,
            value: (
              <span lang="en" className="font-latin">
                {c.year}
              </span>
            ),
          },
        ]}
      />
      <CaseCover src={work.image} alt={card.alt} label={card.alt} />
      <CaseChapter
        id="challenge-title"
        eyebrow={L.challenge}
        title={c.challenge.title}
        paragraphs={[c.challenge.situation, c.challenge.goal]}
      />
      <CaseChapter
        id="approach-title"
        eyebrow={L.approach}
        title={c.approach.title}
        paragraphs={[c.approach.text]}
        chips={t.home.process.steps.map((s) => s.title)}
      >
        <CaseGallery
          caption={c.approach.caption}
          images={{
            key: { src: work.image, alt: alt(L.images.key), position: caseGalleryCrops.key },
            small: [
              { src: work.image, alt: alt(L.images.mobile), position: caseGalleryCrops.mobile },
              { src: work.image, alt: alt(`${L.images.mobile} 2`), position: caseGalleryCrops.mobileAlt },
              { src: work.image, alt: alt(L.images.detail), position: caseGalleryCrops.detail },
            ],
          }}
        />
      </CaseChapter>
      <CaseResult eyebrow={L.result} statement={c.result} metrics={proof?.metrics} locale={lang} />
      {proof?.quote ? <CaseQuoteBlock eyebrow={L.quote} quote={proof.quote} locale={lang} /> : null}
      <NextProject
        eyebrow={L.next}
        href={localizedPath(`/work/${next.id}`, lang)}
        name={t.home.work.items[next.id].client}
        tags={next.tags.map((tag) => t.home.work.tags[tag])}
        cta={L.next.cta}
        image={{ src: next.image, alt: t.home.work.items[next.id].alt }}
      />
      <FinalCta
        t={{ ...L.cta, whatsapp: t.home.cta.whatsapp }}
        startHref={localizedPath(startHref, lang)}
        startLabel={t.nav.start}
        whatsapp={whatsappHref(site.whatsapp)}
      />
    </main>
  );
}
