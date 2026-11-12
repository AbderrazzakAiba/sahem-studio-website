"use client";

import { useParams } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { NotFoundView } from "@/components/sections/NotFoundView";
import type { ChromeCopy } from "@/lib/dictionaries";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

/**
 * 404 for notFound() thrown inside the [lang] tree, with the site's header and footer. The language is already
 * in the URL, so it is read with useParams (known during server rendering too — no flash). Reading a request
 * header instead would turn every page from static into partially dynamic, because this boundary is part of
 * every page; so the header/footer words of the three languages are passed in (a few hundred bytes each).
 */
export function NotFoundFromParams({ chrome }: { chrome: Record<Locale, ChromeCopy> }) {
  const params = useParams<{ lang?: string }>();
  const lang = params?.lang && isLocale(params.lang) ? params.lang : defaultLocale;
  return (
    <>
      <Header locale={lang} t={chrome[lang]} />
      <NotFoundView lang={lang} />
      <Footer locale={lang} t={chrome[lang]} />
    </>
  );
}
