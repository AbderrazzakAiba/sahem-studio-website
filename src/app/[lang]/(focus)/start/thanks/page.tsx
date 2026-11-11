import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { site, whatsappHref } from "@/content/site";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localizedPath } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/start/thanks">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = await getDictionary(lang);
  // A confirmation page: never indexed.
  return { title: t.thanks.meta.title, robots: { index: false, follow: true } };
}

/**
 * Brief sent (handoff thanks screen): the route has hit its goal — what happens next in three stations, a way
 * home, a direct contact and the studio's social accounts.
 */
export default async function ThanksPage({ params }: PageProps<"/[lang]/start/thanks">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const th = t.thanks;
  const wa = whatsappHref(site.whatsapp);

  return (
    <main id="main" className="py-14 md:py-24">
      <Container className="flex max-w-[880px] flex-col gap-10 md:gap-14">
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="size-4 rounded-dot bg-accent-signal md:size-5" />
            <Eyebrow label={th.eyebrow} latin={th.latin} />
          </div>
          <h1 className="text-display">
            <span className="hero-line block overflow-hidden pb-[0.08em]">
              <span className="block">{th.title}</span>
            </span>
          </h1>
        </div>

        <ol className="relative flex flex-col gap-7 border-s-(length:--route-stroke) border-route-line ps-7 md:gap-9 md:ps-10">
          {th.next.map((line, i) => (
            <li key={line} className="relative flex items-baseline gap-4">
              <span
                aria-hidden="true"
                className="absolute -start-[calc(1.75rem+var(--route-stroke)/2+var(--route-node-size)/2)] top-1.5 size-(--route-node-size) rounded-dot border-[3px] border-route-line bg-route-node md:-start-[calc(2.5rem+var(--route-stroke)/2+var(--route-node-size)/2)]"
              />
              <span className="text-index text-text-secondary">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[18px] font-medium md:text-[22px]">{line}</span>
            </li>
          ))}
        </ol>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button asChild dot>
            <Link href={localizedPath("/", lang)}>{th.home}</Link>
          </Button>
          {wa ? (
            <Button asChild variant="secondary">
              <a href={wa} target="_blank" rel="noopener noreferrer">
                {th.whatsapp}
              </a>
            </Button>
          ) : (
            <Button asChild variant="secondary">
              <a href={`mailto:${site.email}`}>{th.email}</a>
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-border-subtle pt-6">
          <span className="text-[15px] text-text-secondary">{th.follow}</span>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {site.socials.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center font-semibold underline-offset-4 hover:underline"
                >
                  <bdi dir="ltr" className="font-latin">
                    {s.name}
                    {s.handle ? ` · ${s.handle}` : ""}
                  </bdi>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </main>
  );
}
