import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/layout/Section";
import { FinalCta } from "@/components/sections/FinalCta";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { WorkFilter } from "@/components/work/WorkFilter";
import { featuredWork, type WorkTag } from "@/content/home";
import { site, startHref, whatsappHref } from "@/content/site";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localeInfo, localizedPath, locales } from "@/lib/i18n";

/** Filter chips in the order of the services. */
const filters: WorkTag[] = ["website", "landing", "identity", "social", "automation", "motion"];

export async function generateMetadata({ params }: PageProps<"/[lang]/work">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = await getDictionary(lang);
  return {
    title: t.workPage.meta.title,
    description: t.workPage.meta.description,
    alternates: {
      canonical: localizedPath("/work", lang),
      languages: Object.fromEntries(locales.map((l) => [localeInfo[l].hreflang, localizedPath("/work", l)])),
    },
  };
}

/**
 * Works list (handoff: work-desktop / tablet / mobile): page hero, filterable projects, final call to action.
 * Projects are demo content until the team supplies real work.
 */
export default async function WorkPage({ params }: PageProps<"/[lang]/work">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const w = t.workPage;

  return (
    <main id="main">
      <PageHero
        breadcrumb={{
          label: t.a11y.breadcrumb,
          items: [{ label: t.nav.home, href: localizedPath("/", lang) }, { label: t.nav.work }],
        }}
        eyebrow={w.eyebrow}
        latin={w.latin}
        title={w.title}
        lead={w.lead}
      />
      <Section aria-label={w.listLabel} className="pt-2 md:pt-6">
        <Container>
          <WorkFilter works={featuredWork} filters={filters} copy={w} cards={t.home.work} locale={lang} />
        </Container>
      </Section>
      <FinalCta
        t={{ ...w.cta, whatsapp: t.home.cta.whatsapp }}
        startHref={localizedPath(startHref, lang)}
        startLabel={t.nav.start}
        whatsapp={whatsappHref(site.whatsapp)}
      />
    </main>
  );
}
