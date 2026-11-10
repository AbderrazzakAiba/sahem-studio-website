import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WorkCard } from "@/components/work/WorkCard";
import type { featuredWork } from "@/content/home";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

type Props = {
  heading: { eyebrow: string; latin: string; title: string };
  all: { href: string; label: string };
  works: (typeof featuredWork)[number][];
  t: Pick<Dictionary["home"]["work"], "items" | "tags">;
  locale: Locale;
};

/**
 * "Related work" — the proof (Ink section): up to two projects for this service, two columns from tablet up.
 * id="work" so the hero's "Website work" button jumps here.
 */
export function RelatedWork({ heading, all, works, t, locale }: Props) {
  if (works.length === 0) return null;
  return (
    <Section id="work" ink aria-labelledby="work-title">
      <Container className="flex flex-col gap-8 md:gap-12">
        <SectionHeading
          id="work-title"
          eyebrow={heading.eyebrow}
          latin={heading.latin}
          title={heading.title}
          action={<LinkArrow href={all.href}>{all.label}</LinkArrow>}
        />
        <Reveal as="ul" stagger className="grid gap-10 md:grid-cols-2 md:gap-6">
          {works.map((work, i) => (
            <li key={work.id}>
              <WorkCard work={work} index={i} t={t} locale={locale} />
            </li>
          ))}
        </Reveal>
        <LinkArrow href={all.href} className="md:hidden">
          {all.label}
        </LinkArrow>
      </Container>
    </Section>
  );
}
