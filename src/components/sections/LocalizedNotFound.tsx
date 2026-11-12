import { headers } from "next/headers";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { NotFoundView } from "@/components/sections/NotFoundView";
import { notFoundCopy } from "@/content/notFound";
import { getDictionary } from "@/lib/dictionaries";
import { defaultLocale, isLocale } from "@/lib/i18n";

/**
 * The 404 content with the site's header and footer, in the visitor's language (read from the `x-sahem-locale`
 * header the proxy adds to every request). Reading a header is request-time data: render this inside
 * <Suspense> (Cache Components). Used by app/global-not-found.tsx (unknown addresses) and
 * app/[lang]/not-found.tsx (notFound() from a page, e.g. an unknown service or project).
 */
export async function LocalizedNotFound() {
  const requested = (await headers()).get("x-sahem-locale") ?? "";
  const lang = isLocale(requested) ? requested : defaultLocale;
  const t = await getDictionary(lang);
  return (
    <>
      <title>{`${notFoundCopy[lang].title} — ${t.site.name}`}</title>
      <Header locale={lang} t={t} />
      <NotFoundView lang={lang} />
      <Footer locale={lang} t={t} />
    </>
  );
}
