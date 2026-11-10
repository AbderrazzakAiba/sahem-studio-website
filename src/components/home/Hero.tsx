import Link from "next/link";
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
 * actions. Each headline line sits in an overflow-hidden mask so the motion phase can raise it into view.
 */
export function Hero({ t, stations, startHref, startLabel, locale }: Props) {
  return (
    <Section rail={false} aria-labelledby="hero-title" className="pt-8 md:pt-14 lg:pt-[clamp(40px,5vw,72px)]">
      <Container className="flex flex-col gap-5.5 md:gap-7">
        <Eyebrow label={t.eyebrow} latin={t.latin} />
        <h1 id="hero-title" className="text-hero">
          {t.titleLines.map((line) => (
            <span key={line} className="block overflow-hidden pb-[0.08em]">
              <span className="block">{line}</span>
            </span>
          ))}
        </h1>

        <HeroRoute stations={stations} rtl={localeInfo[locale].dir === "rtl"} />

        <div className="flex flex-col gap-6 md:flex-row md:flex-wrap md:items-end md:justify-between md:gap-8">
          <p className="max-w-[540px] text-lead text-text-secondary">{t.lead}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
