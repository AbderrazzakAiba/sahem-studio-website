import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Dictionary } from "@/lib/dictionaries";

type Props = {
  t: Dictionary["home"]["cta"];
  startHref: string;
  startLabel: string;
  whatsapp: string | null;
};

/**
 * The goal — the route's final hit: the rail comes down from the FAQ, turns, and its arrowhead strikes the
 * "Start your project" button, with a Signal burst at the point of impact. The WhatsApp link shows only once
 * the number is set.
 */
export function FinalCta({ t, startHref, startLabel, whatsapp }: Props) {
  return (
    <Section rail={false} aria-labelledby="cta-title" className="py-22 md:py-[clamp(96px,70px+6.1vw,160px)]">
      <Container className="flex flex-col gap-7 md:gap-10">
        <SectionHeading
          id="cta-title"
          eyebrow={t.eyebrow}
          latin={t.latin}
          title={t.title}
          lead={t.lead}
          size="display"
        />

        <div className="flex flex-col gap-3 md:gap-5">
          <div className="flex items-stretch">
            <Button
              asChild
              dot
              size="lg"
              className="relative z-[1] max-md:min-h-16 max-md:flex-1 max-md:px-5 max-md:text-[18px] md:px-10 md:text-[20px]"
            >
              <Link href={startHref}>{startLabel}</Link>
            </Button>
            <RouteHit />
          </div>
          {whatsapp ? (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center self-start font-semibold underline-offset-4 hover:underline"
            >
              {t.whatsapp}
            </a>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}

/** Arrowhead + line + corner up into the rail, and the Signal burst. Decorative. */
function RouteHit() {
  return (
    <span
      aria-hidden="true"
      className="relative -me-[calc(var(--page-margin)/2)] flex w-13 shrink-0 items-center md:w-auto md:min-w-30 md:flex-[1_1_120px]"
    >
      <svg
        viewBox="0 0 26 26"
        preserveAspectRatio="none"
        focusable="false"
        className="h-[18px] w-4 shrink-0 md:size-[26px] ltr:-scale-x-100"
      >
        <path d="M26 13L0 1V25Z" className="fill-route-line" />
      </svg>
      <span className="h-(--route-stroke) flex-1 bg-route-line" />
      <span className="relative size-5 shrink-0 -translate-y-[calc((20px_-_var(--route-stroke))/2)] rounded-ee-[20px] border-e-(length:--route-stroke) border-b-(length:--route-stroke) border-route-line md:size-10 md:-translate-y-[calc((40px_-_var(--route-stroke))/2)] md:rounded-ee-[40px]">
        <span className="absolute -end-(--route-stroke) bottom-full h-[4000px] w-(--route-stroke) bg-route-line" />
      </span>
      <svg
        viewBox="0 0 24 56"
        focusable="false"
        className="absolute -start-4 top-1/2 z-[2] h-11 w-4 -translate-y-1/2 md:-start-6 md:h-14 md:w-6 ltr:-scale-x-100"
      >
        <path d="M4 14L12 6M6 28H18M4 42L12 50" fill="none" strokeWidth={3} className="stroke-accent-signal" />
      </svg>
    </span>
  );
}
