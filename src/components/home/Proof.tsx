import { Section } from "@/components/layout/Section";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/dictionaries";

/** "Talk is cheap. See the work." — the bridge into the Ink Work section. */
export function Proof({ t }: { t: Dictionary["home"]["proof"] }) {
  return (
    <Section aria-labelledby="proof-title" className="py-14 md:py-20 lg:py-(--section-padding)">
      <Container>
        <h2 id="proof-title" className="text-display">
          {t.lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
      </Container>
    </Section>
  );
}
