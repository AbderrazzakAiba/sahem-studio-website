import Link from "next/link";
import { RouteHit } from "@/components/sections/RouteHit";
import { Section } from "@/components/layout/Section";
import { Button, SignalDot } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
/** The words of a final call to action — each page passes its own (home, services, a service…). */
export type CtaCopy = { eyebrow: string; latin: string; title: string; lead: string; whatsapp: string };

type Props = {
  t: CtaCopy;
  startHref: string;
  startLabel: string;
  whatsapp: string | null;
  /** Optional line under the button (e.g. the service already selected in the form). */
  note?: string;
};

/**
 * The goal — the route's final hit, shared by every page: the rail comes down from the section above, turns,
 * and its arrowhead strikes the "Start your project" button with a Signal burst (RouteHit, M-18). The WhatsApp
 * link shows only once the number is set.
 */
export function FinalCta({ t, startHref, startLabel, whatsapp, note }: Props) {
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
          {note ? (
            <p className="flex items-center gap-2 text-[14px] text-text-secondary">
              <SignalDot />
              {note}
            </p>
          ) : null}
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
