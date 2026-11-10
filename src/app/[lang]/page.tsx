import { notFound } from "next/navigation";
import { Faq } from "@/components/home/Faq";
import { FinalCta } from "@/components/home/FinalCta";
import { Hero } from "@/components/home/Hero";
import { Process } from "@/components/home/Process";
import { Proof } from "@/components/home/Proof";
import { Services } from "@/components/home/Services";
import { Why } from "@/components/home/Why";
import { Work } from "@/components/home/Work";
import { site, startHref, whatsappHref } from "@/content/site";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localizedPath } from "@/lib/i18n";

/**
 * Home (handoff: home-desktop / home-tablet / home-mobile). The route runs through the whole page:
 * hero band → rail through every section → the Ink peak (Work) → the final hit on "Start your project".
 */
export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const start = localizedPath(startHref, lang);
  const wa = whatsappHref(site.whatsapp);

  return (
    <main id="main">
      <Hero
        t={t.home.hero}
        stations={t.home.process.steps.map((s) => s.title)}
        startHref={start}
        startLabel={t.nav.start}
        locale={lang}
      />
      <Why t={t.home.why} />
      <Services t={t.home.services} locale={lang} />
      <Process t={t.home.process} />
      <Proof t={t.home.proof} />
      <Work t={t.home.work} locale={lang} />
      <Faq t={t.home.faq} whatsapp={wa} email={site.email} />
      <FinalCta t={t.home.cta} startHref={start} startLabel={t.nav.start} whatsapp={wa} />
    </main>
  );
}
