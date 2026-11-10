import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { LinkArrow } from "@/components/ui/LinkArrow";
import type { Dictionary } from "@/lib/dictionaries";

type Props = {
  t: Dictionary["services"]["help"];
  /** WhatsApp link when the number is set; otherwise the button offers email. */
  whatsapp: string | null;
  email: string;
  processHref: string;
};

/**
 * "Not sure where to start?" (handoff services screen): a short reassurance on one side, a direct contact
 * button and a link to the process page on the other. Stacked below 1024px.
 */
export function ServicesHelp({ t, whatsapp, email, processHref }: Props) {
  return (
    <Section aria-labelledby="help-title">
      <Container className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <Reveal stagger className="flex flex-col gap-3 md:gap-4">
          <Eyebrow label={t.eyebrow} latin={t.latin} />
          <h2 id="help-title" className="text-heading">
            {t.title}
          </h2>
          <p className="max-w-[620px] text-[16px] leading-[1.75] text-text-secondary md:text-[18px]">{t.lead}</p>
        </Reveal>
        <Reveal stagger className="flex flex-col items-start gap-3">
          {whatsapp ? (
            <Button asChild variant="secondary" className="max-md:w-full">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                <Icon name="whatsapp" />
                {t.whatsapp}
              </a>
            </Button>
          ) : (
            <Button asChild variant="secondary" className="max-md:w-full">
              <a href={`mailto:${email}`}>{t.email}</a>
            </Button>
          )}
          <LinkArrow href={processHref}>{t.process}</LinkArrow>
        </Reveal>
      </Container>
    </Section>
  );
}
