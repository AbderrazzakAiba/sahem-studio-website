import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { featuredWork } from "@/content/home";
import type { Dictionary } from "@/lib/dictionaries";
import { localizedPath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Props = { t: Dictionary["home"]["work"]; locale: Locale };

/**
 * Selected work — the only Ink section (the page's peak). Colours flip through data-theme="ink".
 *  - Mobile: projects stacked (the first two), then an "All work" button.
 *  - Tablet / desktop: a horizontal gallery that scrolls with snap, plus the route progress bar.
 * The motion phase pins the gallery on desktop and drives the bar with the scroll; here the bar is static.
 * Projects are placeholders until the team supplies real work (handoff D-025).
 */
export function Work({ t, locale }: Props) {
  const allHref = localizedPath("/work", locale);

  return (
    <Section id="work" ink aria-labelledby="work-title">
      <Container className="flex flex-col gap-7 md:gap-9 lg:gap-12">
        <SectionHeading
          id="work-title"
          eyebrow={t.eyebrow}
          latin={t.latin}
          title={t.title}
          action={<LinkArrow href={allHref}>{t.all}</LinkArrow>}
        />

        <div role="region" aria-label={t.galleryLabel} tabIndex={0} className="max-md:contents">
          <ul className="flex flex-col gap-10 md:snap-x md:snap-mandatory md:[scrollbar-width:none] md:flex-row md:gap-5 md:overflow-x-auto md:overscroll-x-contain lg:gap-6 md:[&::-webkit-scrollbar]:hidden">
            {featuredWork.map((work, i) => (
              <li
                key={i}
                className={cn(
                  "md:shrink-0 md:basis-[300px] md:snap-start lg:basis-[min(520px,82%)]",
                  i >= 2 && "max-md:hidden",
                )}
              >
                <Link
                  href={localizedPath(work.slug ? `/work/${work.slug}` : "/work", locale)}
                  className="group/work flex flex-col gap-3 lg:gap-4"
                >
                  <div className="flex aspect-[4/3] items-center justify-center border border-border-subtle bg-bg-raised transition-colors duration-[var(--duration-instant)] group-hover/work:border-border-control">
                    <span
                      lang="en"
                      dir="ltr"
                      className="font-latin text-[11px] tracking-[0.14em]! text-text-secondary lg:text-[12px]"
                    >
                      {t.imagePlaceholder}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-card-title">{t.client}</h3>
                    <span className="text-index text-text-secondary">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 lg:gap-2">
                    {work.tags.map((tag) => (
                      <Tag key={tag} className="min-h-7 border-border-control px-2.5 lg:min-h-[30px] lg:px-3">
                        {t.tags[tag]}
                      </Tag>
                    ))}
                  </div>
                  <p className="text-[15px] leading-[1.6] text-text-secondary">{t.result}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Route progress bar (static for now) */}
        <div aria-hidden="true" className="relative h-5 max-md:hidden lg:h-[22px]">
          <span className="absolute inset-x-0 top-2 h-(--route-stroke) bg-border-subtle" />
          <span className="absolute start-0 top-2 h-(--route-stroke) w-1/3 bg-route-line" />
          <span className="absolute start-[calc(100%/3_-_9px)] top-px size-[18px] rounded-dot bg-accent-signal lg:start-[calc(100%/3_-_11px)] lg:top-0 lg:size-[21px]" />
        </div>

        <Button asChild variant="secondary" className="md:hidden">
          <Link href={allHref}>{t.all}</Link>
        </Button>
      </Container>
    </Section>
  );
}
