import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Tag } from "@/components/ui/Tag";

type StepCopy = { latin: string; line: string; duration: string; what: string; role: string; get: string };
type Labels = { duration: string; what: string; role: string; get: string };

/**
 * One station of the process page (handoff process screen): number + name, the station's title, one line and
 * its usual duration on one side; "What we do · Your part · You get" on the other (1 : 1.5, stacked below
 * 1024px). Each station is its own section on the rail, so its node lights up as you reach it (M-08).
 */
export function ProcessStep({
  index,
  title,
  step,
  labels,
}: {
  index: number;
  title: string;
  step: StepCopy;
  labels: Labels;
}) {
  const id = `step-${index + 1}`;
  const rows: [string, string, boolean][] = [
    [labels.what, step.what, false],
    [labels.role, step.role, false],
    [labels.get, step.get, true],
  ];
  return (
    <Section aria-labelledby={id}>
      <Container className="grid items-start gap-8 md:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-16">
        <Reveal stagger className="flex flex-col gap-3 md:gap-4">
          <Eyebrow
            label={String(index + 1).padStart(2, "0")}
            latin={step.latin || undefined}
            className="[&>span:first-child]:font-latin [&>span:first-child]:text-[13px]"
          />
          <h2 id={id} className="text-[clamp(40px,26px+3.6vw,80px)] leading-[1.15] font-semibold">
            {title}
          </h2>
          <p className="max-w-[520px] text-[17px] leading-[1.7] text-text-secondary md:text-[18px]">{step.line}</p>
          <Tag className="mt-1">
            {labels.duration} {step.duration}
          </Tag>
        </Reveal>
        <Reveal as="dl" stagger className="border-t border-border-subtle">
          {rows.map(([dt, dd, strong]) => (
            <div
              key={dt}
              className={
                strong
                  ? "grid gap-1.5 border-b-2 border-border-strong py-5 md:grid-cols-[160px_minmax(0,1fr)] md:gap-6"
                  : "grid gap-1.5 border-b border-border-subtle py-5 md:grid-cols-[160px_minmax(0,1fr)] md:gap-6"
              }
            >
              <dt className="font-semibold">{dt}</dt>
              <dd
                className={
                  strong
                    ? "text-[17px] leading-[1.6] font-semibold md:text-[18px]"
                    : "text-[clamp(16px,15.26px+0.19vw,18px)] leading-[1.75] text-text-secondary"
                }
              >
                {dd}
              </dd>
            </div>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}

/**
 * "About" (Ink section) — kept on the process page until a separate About page has real content (handoff
 * D-014). Text beside an image frame; until a team photo exists the frame shows the studio's symbol.
 */
export function AboutStudio({
  copy,
  name,
}: {
  copy: { eyebrow: string; latin: string; title: string; lead: string; body: string };
  name: string;
}) {
  return (
    <Section ink aria-labelledby="about-title">
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal stagger className="flex flex-col gap-4 md:gap-5">
          <Eyebrow label={copy.eyebrow} latin={copy.latin} />
          <h2 id="about-title" className="text-heading">
            {copy.title}
          </h2>
          <p className="max-w-[620px] text-lead text-text-secondary">{copy.lead}</p>
          <p className="max-w-[620px] text-[clamp(16px,15.26px+0.19vw,18px)] leading-[1.75] text-text-secondary">
            {copy.body}
          </p>
        </Reveal>
        <div
          role="img"
          aria-label={name}
          className="grid aspect-[4/3] place-items-center border border-border-subtle bg-bg-raised"
        >
          {/* The brand symbol (handoff logo SVG), large — placeholder until a team photo is supplied. */}
          <svg viewBox="-5.6 2 124.3 150" aria-hidden="true" focusable="false" className="h-1/2 w-auto">
            <path
              d="M36 139H60A31 31 0 0 0 60 77A31 31 0 0 1 60 15H94"
              fill="none"
              stroke="currentColor"
              strokeWidth="26"
            />
            <path d="M93.5 2L118.7 15L93.5 28Z" fill="currentColor" />
            <circle cx="7.4" cy="139" r="13" className="fill-accent-signal" />
          </svg>
        </div>
      </Container>
    </Section>
  );
}
