import { Section } from "@/components/layout/Section";
import { ScrubWords } from "@/components/motion/ScrubWords";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/dictionaries";

/** "Talk is cheap. See the work." — the bridge into the Ink Work section; words light up with the scroll (M-12). */
export function Proof({ t }: { t: Dictionary["home"]["proof"] }) {
  return (
    <Section aria-labelledby="proof-title" className="py-14 md:py-20 lg:py-(--section-padding)">
      <Container>
        <ScrubWords id="proof-title" lines={t.lines} className="text-display" />
      </Container>
    </Section>
  );
}
