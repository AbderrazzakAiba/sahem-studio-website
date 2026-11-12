import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutStudio, ProcessStep } from "@/components/process/ProcessSections";
import { FinalCta } from "@/components/sections/FinalCta";
import { PageHero } from "@/components/sections/PageHero";
import { site, startHref, whatsappHref } from "@/content/site";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localeInfo, localizedPath, locales } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/process">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = await getDictionary(lang);
  return {
    title: t.processPage.meta.title,
    description: t.processPage.meta.description,
    alternates: {
      canonical: localizedPath("/process", lang),
      languages: Object.fromEntries(locales.map((l) => [localeInfo[l].hreflang, localizedPath("/process", l)])),
    },
  };
}

/**
 * Process & about (handoff: process-desktop / tablet / mobile): the four stations in detail — what we do,
 * your part, what you get, usual duration — then "About" until it has its own page (D-014), then the goal.
 */
export default async function ProcessPage({ params }: PageProps<"/[lang]/process">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const p = t.processPage;

  return (
    <main id="main">
      <PageHero
        breadcrumb={{
          label: t.a11y.breadcrumb,
          items: [{ label: t.nav.home, href: localizedPath("/", lang) }, { label: t.nav.process }],
        }}
        eyebrow={p.eyebrow}
        latin={p.latin}
        title={p.title}
        lead={p.lead}
      />
      {p.steps.map((step, i) => (
        <ProcessStep key={i} index={i} title={t.home.process.steps[i].title} step={step} labels={p.labels} />
      ))}
      <AboutStudio copy={p.about} name={t.site.name} />
      <FinalCta
        t={{ ...p.cta, whatsapp: t.home.cta.whatsapp }}
        startHref={localizedPath(startHref, lang)}
        startLabel={t.nav.start}
        whatsapp={whatsappHref(site.whatsapp)}
      />
    </main>
  );
}
