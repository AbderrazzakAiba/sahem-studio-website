import type { CSSProperties, ReactNode } from "react";
import { Section } from "@/components/layout/Section";
import { RouteStart } from "@/components/route/RouteStart";
import { Breadcrumb, type Crumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Props = {
  breadcrumb: { items: Crumb[]; label: string };
  eyebrow: string;
  latin?: string;
  title: string;
  lead?: string;
  /** Extra content under the lead (e.g. actions). */
  children?: ReactNode;
};

/**
 * Opening of an inner page (handoff services screen): breadcrumb, eyebrow, the page title (h1) in a mask that
 * rises on load, the lead, then the route starts and turns down into the rail of the next section.
 * The h1 is the page's only level-1 heading; the section is labelled by it.
 */
export function PageHero({ breadcrumb, eyebrow, latin, title, lead, children }: Props) {
  return (
    <Section rail={false} aria-labelledby="page-title" className="pt-[clamp(16px,3vw,40px)] pb-[clamp(24px,4vw,64px)]">
      <Container className="flex flex-col gap-5 md:gap-7">
        <Breadcrumb items={breadcrumb.items} label={breadcrumb.label} />
        <Eyebrow label={eyebrow} latin={latin} className="hero-fade" />
        <h1 id="page-title" className="max-w-[1100px] text-display">
          <span className="hero-line block overflow-hidden pb-[0.08em]">
            <span className="block">{title}</span>
          </span>
        </h1>
        {lead ? (
          <p className="hero-fade max-w-[620px] text-lead text-text-secondary" style={{ "--i": 1 } as CSSProperties}>
            {lead}
          </p>
        ) : null}
        {children}
        <RouteStart />
      </Container>
    </Section>
  );
}
