import { Section } from "@/components/layout/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Dictionary } from "@/lib/dictionaries";

type Props = {
  t: Dictionary["home"]["faq"];
  /** WhatsApp link when the number is set; otherwise the note offers email. */
  whatsapp: string | null;
  email: string;
};

/**
 * FAQ — native <details>/<summary> (keyboard and screen-reader support built in), first item open.
 * Desktop: heading + "didn't find your answer?" on one side, questions on the other. Mobile: stacked,
 * the note after the questions. Answers are placeholders until the team writes them.
 */
export function Faq({ t, whatsapp, email }: Props) {
  return (
    <Section aria-labelledby="faq-title">
      <Container className="grid items-start gap-5 md:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-x-16 lg:gap-y-4">
        <SectionHeading
          id="faq-title"
          eyebrow={t.eyebrow}
          latin={t.latin}
          title={t.title}
          className="lg:col-start-1 lg:row-start-1"
        />

        <div className="border-t border-border-subtle lg:col-start-2 lg:row-span-2 lg:row-start-1">
          {t.items.map((item, i) => (
            <details key={item.q} open={i === 0} className="group/faq border-b border-border-subtle">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-3 text-[17px] font-medium md:min-h-[72px] md:gap-4 md:text-[19px] lg:min-h-[76px] lg:text-[20px] [&::-webkit-details-marker]:hidden">
                {item.q}
                <span aria-hidden="true" className="relative size-3.5 shrink-0 md:size-4">
                  <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-current" />
                  <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-current transition-transform duration-[var(--duration-fast)] ease-[var(--ease-route)] group-open/faq:scale-y-0 motion-reduce:transition-none" />
                </span>
              </summary>
              <p className="mb-5 max-w-[640px] text-[15px] leading-[1.75] text-text-secondary md:mb-6 md:text-[16px]">
                {item.a}
              </p>
            </details>
          ))}
        </div>

        <p className="text-[15px] text-text-secondary lg:col-start-1 lg:row-start-2 lg:text-lead">
          {t.notFound}{" "}
          {whatsapp ? (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-text-primary underline-offset-4 hover:underline"
            >
              {t.whatsapp}
            </a>
          ) : (
            <a href={`mailto:${email}`} className="font-semibold text-text-primary underline-offset-4 hover:underline">
              {t.email}
            </a>
          )}
        </p>
      </Container>
    </Section>
  );
}
