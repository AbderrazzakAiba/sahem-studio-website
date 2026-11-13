import { JsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { ServiceHero } from "@/components/services/ServiceHero";
import { MoreServices, ServiceDeliverables, ServiceForYou, ServiceRoute } from "@/components/services/ServiceSections";
import { RelatedWork } from "@/components/work/RelatedWork";
import { serviceSlugs } from "@/content/home";
import { coverOf, isServiceSlug, relatedWork } from "@/content/services";
import { site, startHref, whatsappHref } from "@/content/site";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localizedPath } from "@/lib/i18n";
import { languageAlternates } from "@/lib/seo";
import { serviceSchema } from "@/lib/structured-data";

/** The six service pages, for every locale (the [lang] segment's params come from the root layout). */
export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/services/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang) || !isServiceSlug(slug)) return {};
  const t = await getDictionary(lang);
  const path = `/services/${slug}`;
  return {
    title: t.home.services.items[slug].title,
    description: t.service.items[slug].lead,
    alternates: {
      canonical: localizedPath(path, lang),
      languages: languageAlternates(path),
    },
  };
}

/**
 * Service page template (handoff: service-desktop / tablet / mobile, D-024): who it is for → what you get →
 * how we work → related work → FAQ → other services → goal. The final call to action opens the form with the
 * service pre-selected (/start?service=slug). Copy is draft content for the team's review.
 */
export default async function ServicePage({ params }: PageProps<"/[lang]/services/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang) || !isServiceSlug(slug)) notFound();
  const t = await getDictionary(lang);
  const L = t.service.labels;
  const s = t.service.items[slug];
  const name = t.home.services.items[slug].title;
  const index = String(serviceSlugs.indexOf(slug) + 1).padStart(2, "0");
  const counter = `${index} / ${String(serviceSlugs.length).padStart(2, "0")}`;
  const wa = whatsappHref(site.whatsapp);
  const start = `${localizedPath(startHref, lang)}?service=${slug}`;
  const cover = coverOf(slug);

  return (
    <main id="main">
      <JsonLd data={serviceSchema(lang, `/services/${slug}`, { name, description: s.lead })} />
      <ServiceHero
        slug={slug}
        breadcrumb={{
          label: t.a11y.breadcrumb,
          items: [
            { label: t.nav.home, href: localizedPath("/", lang) },
            { label: t.nav.services, href: localizedPath("/services", lang) },
            { label: name },
          ],
        }}
        eyebrow={
          L.latinPrefix
            ? { label: L.eyebrow, latin: `${L.latinPrefix} ${counter}` }
            : { label: `${L.eyebrow} ${counter}`, latin: "" }
        }
        title={name}
        lead={s.lead}
        start={{ href: start, label: t.nav.start }}
        seeWork={s.seeWork}
        image={{ src: cover.image, alt: t.home.work.items[cover.id].alt }}
      />
      <ServiceForYou
        heading={{ eyebrow: L.forYouEyebrow, latin: L.forYouLatin, title: L.forYouTitle }}
        items={s.forYou}
      />
      <ServiceDeliverables
        heading={{ eyebrow: L.deliverablesEyebrow, latin: L.deliverablesLatin, title: s.deliverables.title }}
        lead={s.deliverables.lead}
        items={s.deliverables.items}
      />
      <ServiceRoute
        heading={{ eyebrow: L.routeEyebrow, latin: L.routeLatin, title: L.routeTitle }}
        steps={s.steps.map((step, i) => ({
          title: t.home.process.steps[i].title,
          text: step.text,
          chip: `${L.duration} ${step.duration}`,
        }))}
        process={{ href: localizedPath("/process", lang), label: L.readProcess }}
      />
      <RelatedWork
        heading={{ eyebrow: L.workEyebrow, latin: L.workLatin, title: s.workTitle }}
        all={{ href: localizedPath("/work", lang), label: L.allWork }}
        works={relatedWork(slug)}
        t={t.home.work}
        locale={lang}
      />
      <Faq
        t={{
          eyebrow: L.faqEyebrow,
          latin: L.faqLatin,
          title: s.faqTitle,
          notFound: t.home.faq.notFound,
          whatsapp: t.home.faq.whatsapp,
          email: t.home.faq.email,
          items: s.faq,
        }}
        whatsapp={wa}
        email={site.email}
      />
      <MoreServices
        eyebrow={L.moreEyebrow}
        latin={L.moreLatin}
        details={L.moreDetails}
        items={serviceSlugs
          .filter((other) => other !== slug)
          .map((other) => ({
            slug: other,
            title: t.home.services.items[other].title,
            href: localizedPath(`/services/${other}`, lang),
          }))}
      />
      <FinalCta
        t={{
          eyebrow: L.ctaEyebrow,
          latin: L.ctaLatin,
          title: s.cta.title,
          lead: s.cta.lead,
          whatsapp: t.home.cta.whatsapp,
        }}
        startHref={start}
        startLabel={t.nav.start}
        whatsapp={wa}
        note={`${name} — ${L.preselected}`}
      />
    </main>
  );
}
