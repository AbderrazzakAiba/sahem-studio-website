import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FinalCta } from "@/components/sections/FinalCta";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceList } from "@/components/services/ServiceList";
import { ServicesHelp } from "@/components/services/ServicesHelp";
import { site, startHref, whatsappHref } from "@/content/site";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localizedPath } from "@/lib/i18n";
import { languageAlternates } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/services">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = await getDictionary(lang);
  return {
    title: t.services.meta.title,
    description: t.services.meta.description,
    alternates: {
      canonical: localizedPath("/services", lang),
      languages: languageAlternates("/services"),
    },
  };
}

/**
 * Services overview (handoff: services-desktop / tablet / mobile): the six services, each linking to its own
 * page, a "not sure yet?" path, and the final call to action.
 */
export default async function ServicesPage({ params }: PageProps<"/[lang]/services">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const s = t.services;

  return (
    <main id="main">
      <PageHero
        breadcrumb={{
          label: t.a11y.breadcrumb,
          items: [{ label: t.nav.home, href: localizedPath("/", lang) }, { label: t.nav.services }],
        }}
        eyebrow={s.eyebrow}
        latin={s.latin}
        title={s.title}
        lead={s.lead}
      />
      <ServiceList locale={lang} label={s.listLabel} details={s.details} items={t.home.services.items} tags={s.tags} />
      <ServicesHelp
        t={s.help}
        whatsapp={whatsappHref(site.whatsapp)}
        email={site.email}
        processHref={localizedPath("/process", lang)}
      />
      <FinalCta
        t={t.home.cta}
        startHref={localizedPath(startHref, lang)}
        startLabel={t.nav.start}
        whatsapp={whatsappHref(site.whatsapp)}
      />
    </main>
  );
}
