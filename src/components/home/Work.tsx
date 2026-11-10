import Link from "next/link";
import { WorkGallery } from "@/components/home/WorkGallery";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { featuredWork } from "@/content/home";
import type { Dictionary } from "@/lib/dictionaries";
import { localeInfo, localizedPath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Props = { t: Dictionary["home"]["work"]; locale: Locale };

/**
 * Selected work — the only Ink section (the page's peak). Colours flip through data-theme="ink".
 *  - Mobile: projects stacked (the first two), then an "All work" button.
 *  - Tablet / desktop: a horizontal gallery that scrolls with snap, plus the route progress bar.
 * Desktop pins the gallery and moves it with the scroll (WorkGallery, M-13).
 * Projects are placeholders until the team supplies real work (handoff D-025).
 */
export function Work({ t, locale }: Props) {
  const allHref = localizedPath("/work", locale);

  return (
    <Section id="work" ink aria-labelledby="work-title">
      <WorkGallery
        label={t.galleryLabel}
        rtl={localeInfo[locale].dir === "rtl"}
        heading={
          <SectionHeading
            id="work-title"
            eyebrow={t.eyebrow}
            latin={t.latin}
            title={t.title}
            action={<LinkArrow href={allHref}>{t.all}</LinkArrow>}
          />
        }
        footer={
          <Button asChild variant="secondary" className="md:hidden">
            <Link href={allHref}>{t.all}</Link>
          </Button>
        }
      >
        {featuredWork.map((work, i) => (
          <li
            key={i}
            className={cn(
              "md:shrink-0 md:basis-[300px] md:snap-start lg:basis-[min(520px,82%,calc((100svh-420px)*4/3))]",
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
      </WorkGallery>
    </Section>
  );
}
