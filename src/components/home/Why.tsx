import { Section } from "@/components/layout/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Dictionary } from "@/lib/dictionaries";

/** Why Sahem — the starting point: one statement and one paragraph, first station on the rail. */
export function Why({ t }: { t: Dictionary["home"]["why"] }) {
  return (
    <Section aria-labelledby="why-title">
      <Container>
        <SectionHeading
          id="why-title"
          eyebrow={t.eyebrow}
          latin={t.latin}
          title={t.title}
          lead={t.lead}
          size="display"
        />
      </Container>
    </Section>
  );
}
