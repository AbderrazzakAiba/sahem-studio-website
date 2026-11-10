import Link from "next/link";
import type { CSSProperties } from "react";
import { HeroRoute } from "@/components/home/HeroRoute";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { Dictionary } from "@/lib/dictionaries";
import { localeInfo, type Locale } from "@/lib/i18n";

type Props = {
  t: Dictionary["home"]["hero"];
  stations: string[];
  startHref: string;
  startLabel: string;
  locale: Locale;
};

/**
 * Hero (handoff D-023): eyebrow, the headline on its own lines, the route band, then the lead and the two
 * actions. Motion (styles/motion.css, pure CSS from first paint): the lines rise out of their masks (M-03), then
 * eyebrow, lead and actions fade up (M-04) while the route draws (HeroRoute).
 */
export function Hero({ t, stations, startHref, startLabel, locale }: Props) {
  return (
    <Section rail={false} aria-labelledby="hero-title" className="pt-8 md:pt-14 lg:pt-[clamp(40px,5vw,72px)]">
      <Container className="flex flex-col gap-5.5 md:gap-7">
        <Eyebrow label={t.eyebrow} latin={t.latin} className="hero-fade" />
        <h1 id="hero-title" className="text-hero">
          {t.titleLines.map((line) => (
            <span key={line} className="hero-line block overflow-hidden pb-[0.08em]">
              <span className="block">{line}</span>
            </span>
          ))}
        </h1>

        <HeroRoute stations={stations} rtl={localeInfo[locale].dir === "rtl"} />

        <div className="flex flex-col gap-6 md:flex-row md:flex-wrap md:items-end md:justify-between md:gap-8">
          <p className="hero-fade max-w-[540px] text-lead text-text-secondary" style={{ "--i": 1 } as CSSProperties}>
            {t.lead}
          </p>
          <div className="hero-fade flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={{ "--i": 2 } as CSSProperties}>
            <Button asChild dot>
              <Link href={startHref}>{startLabel}</Link>
            </Button>
            <Button asChild variant="secondary">
              <a href="#work">{t.seeWork}</a>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
