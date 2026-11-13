import type { MetadataRoute } from "next";
import { localizedPath, locales } from "@/lib/i18n";
import { absoluteUrl, indexablePaths, languageAlternates } from "@/lib/seo";

/**
 * /sitemap.xml — every indexable page in each language, one <url> per language, each listing all its
 * language versions (and x-default) as <xhtml:link>. Next.js does not add the page's own language to that
 * list by itself, which languageAlternates() does.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return indexablePaths.flatMap((path) => {
    const languages = Object.fromEntries(
      Object.entries(languageAlternates(path)).map(([hreflang, href]) => [hreflang, absoluteUrl(href)]),
    );
    return locales.map((locale) => ({
      url: absoluteUrl(localizedPath(path, locale)),
      alternates: { languages },
    }));
  });
}
