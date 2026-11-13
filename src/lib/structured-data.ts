import { site } from "@/content/site";
import { localeInfo, localizedPath, type Locale } from "@/lib/i18n";
import { absoluteUrl, siteUrl } from "@/lib/seo";

/**
 * schema.org descriptions of the studio, its services, FAQs and breadcrumbs (rendered by <JsonLd>).
 * One organisation node with a stable @id; the other nodes point to it instead of repeating it.
 * Only facts the site already shows are stated: no street address, no ratings, no prices.
 */
const organizationId = `${siteUrl}/#organization`;
const websiteId = `${siteUrl}/#website`;

type OrgCopy = { name: string; description: string };

/** The studio (a professional-service business in El Oued, serving Algeria) and the website, on the home page. */
export function organizationGraph(locale: Locale, t: OrgCopy) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": organizationId,
        name: t.name,
        alternateName: ["Sahem Studio", "سهم ستوديو"].filter((n) => n !== t.name),
        description: t.description,
        url: absoluteUrl(localizedPath("/", locale)),
        logo: `${siteUrl}/brand/logo/symbol-primary.svg`,
        image: `${siteUrl}/og/${locale === "ar" ? "og-ar" : "og-en"}.png`,
        email: site.email,
        telephone: site.phones.map((p) => p.tel),
        address: {
          "@type": "PostalAddress",
          addressLocality: "El Oued",
          addressRegion: "El Oued",
          addressCountry: "DZ",
        },
        areaServed: { "@type": "Country", name: "Algeria" },
        knowsLanguage: ["ar", "fr", "en"],
        sameAs: site.socials.map((s) => s.href),
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer service",
            email: site.email,
            telephone: site.phones[0].tel,
            availableLanguage: ["Arabic", "French", "English"],
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteUrl,
        name: t.name,
        inLanguage: localeInfo[locale].hreflang,
        publisher: { "@id": organizationId },
      },
    ],
  };
}

/** One service page: what it is, who provides it, where. */
export function serviceSchema(locale: Locale, path: string, t: { name: string; description: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t.name,
    description: t.description,
    url: absoluteUrl(localizedPath(path, locale)),
    serviceType: t.name,
    provider: { "@id": organizationId },
    areaServed: { "@type": "Country", name: "Algeria" },
    inLanguage: localeInfo[locale].hreflang,
  };
}

/** Questions and answers exactly as they are shown on the page. */
export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** The visible breadcrumb trail; the current page (last item) has no link, as Google allows. */
export function breadcrumbSchema(items: { label: string; href?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}
