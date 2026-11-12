import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localeInfo, localizedPath, locales } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = await getDictionary(lang);
  return {
    title: t.privacy.meta.title,
    description: t.privacy.meta.description,
    alternates: {
      canonical: localizedPath("/privacy", lang),
      languages: Object.fromEntries(locales.map((l) => [localeInfo[l].hreflang, localizedPath("/privacy", l)])),
    },
  };
}

/**
 * Privacy policy (handoff privacy screens): needed because the start form collects contact details.
 * Contents on the side (desktop), seven numbered sections. DRAFT text describing what the site actually does —
 * to be reviewed by a specialist before launch (handoff note).
 */
export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const p = t.privacy;

  return (
    <main id="main">
      <PageHero
        breadcrumb={{
          label: t.a11y.breadcrumb,
          items: [{ label: t.nav.home, href: localizedPath("/", lang) }, { label: p.title }],
        }}
        eyebrow={`${p.updated} ${p.date}`}
        title={p.title}
        lead={p.draft}
      />
      <Section aria-label={p.title} className="pt-2 md:pt-6">
        <Container className="grid items-start gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-20">
          <nav aria-label={p.toc} className="flex flex-col gap-3 lg:sticky lg:top-28">
            <span className="text-[14px] font-semibold text-text-secondary">{p.toc}</span>
            <ol className="flex flex-col border-t border-border-subtle">
              {p.sections.map((s, i) => (
                <li key={s.title} className="border-b border-border-subtle">
                  <a
                    href={`#s-${i + 1}`}
                    className="flex min-h-11 items-center gap-3 py-2 text-[15px] hover:text-text-secondary"
                  >
                    <span className="text-index text-text-secondary">{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="flex max-w-[720px] flex-col gap-12 md:gap-14">
            {p.sections.map((s, i) => (
              <section key={s.title} id={`s-${i + 1}`} aria-labelledby={`s-${i + 1}-title`} className="scroll-mt-28">
                <h2 id={`s-${i + 1}-title`} className="flex items-baseline gap-4 text-title">
                  <span className="text-index text-text-secondary">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </h2>
                <div className="mt-4 flex flex-col gap-4">
                  {s.body.map((para) => (
                    <p key={para} className="text-[clamp(16px,15.26px+0.19vw,18px)] leading-[1.8] text-text-secondary">
                      {para.replace("{email}", site.email)}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
