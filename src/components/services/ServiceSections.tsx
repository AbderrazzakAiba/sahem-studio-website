import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { RouteSteps, type RouteStep } from "@/components/route/RouteSteps";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import type { ServiceSlug } from "@/content/home";

type Heading = { eyebrow: string; latin: string; title: string };

/** "A good fit if…" — three situations, each under a strong top rule with a check (3 / 2 / 1 columns). */
export function ServiceForYou({ heading, items }: { heading: Heading; items: string[] }) {
  return (
    <Section aria-labelledby="for-title">
      <Container className="flex flex-col gap-8 md:gap-12">
        <SectionHeading id="for-title" eyebrow={heading.eyebrow} latin={heading.latin} title={heading.title} />
        <Reveal as="ul" stagger className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {items.map((text) => (
            <li key={text} className="flex flex-col gap-3.5 border-t-2 border-border-strong pt-5">
              <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="size-5.5 shrink-0">
                <circle cx="10" cy="10" r="10" className="fill-route-line" />
                <path d="M5.5 10.5L8.5 13.5L14.5 7" fill="none" strokeWidth={2} className="stroke-bg-page" />
              </svg>
              <p className="text-[17px] leading-[1.6] font-medium md:text-[18px]">{text}</p>
            </li>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}

/** "Deliverables" — heading and lead beside a numbered list of six items; stacked below 1024px. */
export function ServiceDeliverables({
  heading,
  lead,
  items,
}: {
  heading: Heading;
  lead: string;
  items: { title: string; text: string }[];
}) {
  return (
    <Section aria-labelledby="get-title">
      <Container className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.8fr)] lg:gap-16">
        <SectionHeading
          id="get-title"
          eyebrow={heading.eyebrow}
          latin={heading.latin}
          title={heading.title}
          lead={lead}
        />
        <Reveal as="ol" stagger className="border-t border-border-subtle">
          {items.map((item, i) => (
            <li
              key={item.title}
              className="grid grid-cols-[48px_minmax(0,1fr)] items-baseline gap-x-4 gap-y-1.5 border-b border-border-subtle py-5 md:grid-cols-[56px_minmax(0,1fr)] md:gap-x-6 lg:grid-cols-[72px_minmax(0,1fr)_minmax(0,1.3fr)] lg:py-5.5"
            >
              <span className="text-index text-text-secondary">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-[19px] leading-[1.4] font-semibold md:text-[21px]">{item.title}</h3>
              <p className="col-start-2 text-[15px] leading-[1.6] text-text-secondary md:text-[16px] lg:col-start-3">
                {item.text}
              </p>
            </li>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}

/** "The route" — the four stations with each one's duration, and a link to the full process page. */
export function ServiceRoute({
  heading,
  steps,
  process,
}: {
  heading: Heading;
  steps: RouteStep[];
  process: { href: string; label: string };
}) {
  return (
    <Section aria-labelledby="route-title">
      <Container className="flex flex-col gap-8 md:gap-12 lg:gap-14">
        <SectionHeading
          id="route-title"
          eyebrow={heading.eyebrow}
          latin={heading.latin}
          title={heading.title}
          action={<LinkArrow href={process.href}>{process.label}</LinkArrow>}
        />
        <RouteSteps steps={steps} />
        <LinkArrow href={process.href} className="md:hidden">
          {process.label}
        </LinkArrow>
      </Container>
    </Section>
  );
}

/** "More services" — the other five as small cards (5 / 3 / 2 columns). */
export function MoreServices({
  eyebrow,
  latin,
  details,
  items,
}: {
  eyebrow: string;
  latin: string;
  details: string;
  items: { slug: ServiceSlug; title: string; href: string }[];
}) {
  return (
    <Section aria-labelledby="more-title">
      <Container className="flex flex-col gap-6 md:gap-8">
        <Eyebrow label={eyebrow} latin={latin} />
        <h2 id="more-title" className="sr-only">
          {eyebrow}
        </h2>
        <Reveal as="ul" stagger className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-5">
          {items.map((item) => (
            <li key={item.slug} className="flex">
              <Link
                href={item.href}
                className="group/mini flex w-full flex-col gap-3.5 border border-card-border bg-card-bg p-4.5 transition-colors duration-[var(--duration-instant)] hover:border-border-strong md:min-h-[150px] md:p-5.5"
              >
                <ServiceIcon name={item.slug} className="size-8 lg:size-8" />
                <span className="text-[16px] leading-[1.4] font-semibold md:text-[17px]">{item.title}</span>
                <span className="mt-auto flex items-center gap-1.5 text-[14px] font-semibold">
                  {details}
                  <Icon
                    name="arrow"
                    size={14}
                    className="transition-transform duration-[var(--duration-fast)] ease-[var(--ease-route)] group-hover/mini:-translate-x-1 motion-reduce:transition-none ltr:-scale-x-100 ltr:group-hover/mini:translate-x-1"
                  />
                </span>
              </Link>
            </li>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
