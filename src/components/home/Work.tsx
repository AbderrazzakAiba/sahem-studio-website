import Link from "next/link";
import { WorkGallery } from "@/components/home/WorkGallery";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WorkCard } from "@/components/work/WorkCard";
import { featuredWork } from "@/content/home";
import type { Dictionary } from "@/lib/dictionaries";
import { localeInfo, localizedPath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Props = { t: Dictionary["home"]["work"]; locale: Locale };

/**
 * Selected work — the only Ink section (the page's peak). Colours flip through data-theme="ink".
 *  - Mobile: projects stacked (the first three), then an "All work" button.
 *  - Tablet / desktop: a horizontal gallery that scrolls with snap, plus the route progress bar.
 * Desktop pins the gallery and moves it with the scroll (WorkGallery, M-13).
 * Projects are demo content (content/home.ts) until the team supplies real work. Hover: the image scales 1.03
 * inside its frame (M-14).
 */
export function Work({ t, locale }: Props) {
  const allHref = localizedPath("/work", locale);

  return (
    <Section id="work" ink aria-labelledby="work-title">
      <WorkGallery
        label={t.galleryLabel}
        sliderLabel={t.sliderLabel}
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
            key={work.id}
            className={cn(
              "md:shrink-0 md:basis-[300px] md:snap-start lg:basis-[min(520px,82%,calc((100svh-420px)*4/3))]",
              i >= 3 && "max-md:hidden",
            )}
          >
            <WorkCard work={work} index={i} t={t} locale={locale} />
          </li>
        ))}
      </WorkGallery>
    </Section>
  );
}
