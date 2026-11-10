import { Section } from "@/components/layout/Section";
import { RouteSteps } from "@/components/route/RouteSteps";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Dictionary } from "@/lib/dictionaries";

/**
 * Our process — four stations, each with what the client receives (layouts and motion: RouteSteps).
 */
export function Process({ t }: { t: Dictionary["home"]["process"] }) {
  return (
    <Section id="process" aria-labelledby="process-title">
      <BlueprintGrid />
      <Container className="relative flex flex-col gap-8 md:gap-12 lg:gap-16">
        <SectionHeading id="process-title" eyebrow={t.eyebrow} latin={t.latin} title={t.title} lead={t.lead} />

        <RouteSteps steps={t.steps.map((step) => ({ title: step.title, text: step.text, chip: step.deliverable }))} />
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
