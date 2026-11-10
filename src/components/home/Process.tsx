import { Arrowhead, ProcessTimeline } from "@/components/home/ProcessTimeline";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import type { Dictionary } from "@/lib/dictionaries";
import { cn } from "@/lib/utils";

/** Station circle shared by the three layouts below. */
const nodeClass = "absolute size-(--route-node-size) rounded-dot border-[3px] border-route-line bg-route-node";

/**
 * Our process — four stations, each with what the client receives.
 *  - Desktop: one horizontal track (Signal start → arrowhead) with the four stations on it, 4 columns.
 *  - Tablet: 2 × 2, each row joined by its own line; the first station is Signal.
 *  - Mobile: a list whose stations sit on the page rail itself.
 */
export function Process({ t }: { t: Dictionary["home"]["process"] }) {
  return (
    <Section id="process" aria-labelledby="process-title">
      <BlueprintGrid />
      <Container className="relative flex flex-col gap-8 md:gap-12 lg:gap-16">
        <SectionHeading id="process-title" eyebrow={t.eyebrow} latin={t.latin} title={t.title} lead={t.lead} />

        <ProcessTimeline steps={t.steps.length}>
          <Reveal as="ol" stagger className="grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 lg:grid-cols-4 lg:gap-6">
            {t.steps.map((step, i) => (
              <li
                key={step.title}
                className="relative flex flex-col gap-2 pb-9 last:pb-0 md:gap-2.5 md:pt-9 md:pb-0 lg:pt-11"
              >
                <span
                  aria-hidden="true"
                  data-step-node=""
                  className={cn(
                    nodeClass,
                    // mobile: centred on the page rail, out in the margin
                    "end-[calc(var(--rail-x)_+_var(--route-stroke)/2_-_var(--route-node-size)/2_-_var(--page-margin))] top-1",
                    "md:start-0 md:end-auto md:top-0 md:z-[1] lg:start-10",
                    i === 0 && "md:max-lg:border-accent-signal md:max-lg:bg-accent-signal",
                  )}
                />
                {/* tablet: line from this station to the next one in the row, or to the arrowhead */}
                {i % 2 === 0 ? (
                  <span
                    aria-hidden="true"
                    className="absolute start-[19px] -end-8 top-2 hidden h-[3px] bg-route-line md:max-lg:block"
                  />
                ) : null}
                {i === t.steps.length - 1 ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="absolute start-[19px] end-3.5 top-2 hidden h-[3px] bg-route-line md:max-lg:block"
                    />
                    <Arrowhead className="absolute end-0 top-[1.5px] hidden size-4 md:max-lg:block" />
                  </>
                ) : null}

                <span className="text-index text-text-secondary">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-card-title">{step.title}</h3>
                <p className="text-[15px] leading-[1.6] text-text-secondary">{step.text}</p>
                <Tag className="mt-1">{step.deliverable}</Tag>
              </li>
            ))}
          </Reveal>
        </ProcessTimeline>
      </Container>
    </Section>
  );
}

/** Faint construction circles behind the steps (desktop only), as on the handoff screen. */
function BlueprintGrid() {
  return (
    <svg
      viewBox="0 0 600 600"
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute end-[6%] top-1/2 size-[640px] -translate-y-1/2 stroke-border-subtle max-lg:hidden"
      fill="none"
      strokeWidth={1}
    >
      <g strokeDasharray="6 5">
        <circle cx="300" cy="170" r="150" />
        <circle cx="300" cy="430" r="150" />
        <circle cx="300" cy="170" r="62" />
        <circle cx="300" cy="430" r="62" />
      </g>
      <path d="M0 170H600M0 430H600M300 0V600" />
    </svg>
  );
}
