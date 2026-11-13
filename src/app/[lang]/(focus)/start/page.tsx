import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { StartForm } from "@/components/start/StartForm";
import { Container } from "@/components/ui/Container";
import { serviceSlugs } from "@/content/home";
import { privacyHref, site, whatsappHref } from "@/content/site";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localizedPath } from "@/lib/i18n";
import { languageAlternates } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/start">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = await getDictionary(lang);
  return {
    title: t.start.meta.title,
    description: t.start.meta.description,
    alternates: {
      canonical: localizedPath("/start", lang),
      languages: languageAlternates("/start"),
    },
  };
}

/**
 * Start your project (handoff: start-desktop / tablet / mobile). The form reads ?service= to pre-select a
 * service, so it renders in the browser inside a Suspense boundary; the static shell shows the page frame.
 */
export default async function StartPage({ params }: PageProps<"/[lang]/start">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const serviceNames = Object.fromEntries(serviceSlugs.map((s) => [s, t.home.services.items[s].title])) as Record<
    (typeof serviceSlugs)[number],
    string
  >;

  return (
    <main id="main" className="pt-8 pb-16 md:pt-14 md:pb-20">
      <Container>
        <Suspense fallback={<div className="min-h-[70svh]" aria-busy="true" />}>
          <StartForm
            locale={lang}
            t={t.start}
            serviceNames={serviceNames}
            thanksHref={localizedPath("/start/thanks", lang)}
            privacyHref={localizedPath(privacyHref, lang)}
            contact={{ whatsapp: whatsappHref(site.whatsapp), email: site.email }}
          />
        </Suspense>
      </Container>
    </main>
  );
}
