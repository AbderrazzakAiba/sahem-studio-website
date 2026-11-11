import { notFound } from "next/navigation";
import { ActionBar } from "@/components/layout/ActionBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { site, startHref, whatsappHref } from "@/content/site";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localizedPath } from "@/lib/i18n";

/**
 * The regular site pages: header, footer and (below 768px) the fixed action bar.
 * The start form lives in the (focus) group instead, without this chrome (handoff D-026).
 */
export default async function SiteLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const start = { href: localizedPath(startHref, lang), label: t.nav.start };
  const wa = whatsappHref(site.whatsapp);

  return (
    <>
      <Header locale={lang} t={t} />
      {/* Bottom padding below 768px so the fixed action bar never covers content. */}
      <div className="max-md:pb-[calc(72px+env(safe-area-inset-bottom))]">
        {children}
        <Footer locale={lang} t={t} />
      </div>
      <ActionBar start={start} whatsapp={wa ? { href: wa, label: t.contact.whatsappLabel } : null} />
    </>
  );
}
