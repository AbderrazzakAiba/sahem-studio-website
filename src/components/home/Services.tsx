import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { serviceSlugs } from "@/content/home";
import type { Dictionary } from "@/lib/dictionaries";
import { localizedPath, type Locale } from "@/lib/i18n";

type Props = { t: Dictionary["home"]["services"]; locale: Locale };

/**
 * The six services as cards linking to /services/[slug]. 1 column on mobile, 2 on tablet, 3 on desktop.
 * "All services" sits beside the heading from tablet up, and becomes a full-width button on mobile.
 */
export function Services({ t, locale }: Props) {
  const allHref = localizedPath("/services", locale);

  return (
    <Section id="services" aria-labelledby="services-title">
      <Container className="flex flex-col gap-7 md:gap-9 lg:gap-12">
        <SectionHeading
          id="services-title"
          eyebrow={t.eyebrow}
          latin={t.latin}
          title={t.title}
          lead={t.lead}
          action={<LinkArrow href={allHref}>{t.all}</LinkArrow>}
        />

        <Reveal as="ul" stagger className="grid gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6">
          {serviceSlugs.map((slug, i) => (
            <li key={slug} className="flex">
              <Link
                href={localizedPath(`/services/${slug}`, locale)}
                className="group/card flex w-full flex-col gap-2.5 border border-card-border bg-card-bg p-5 transition-colors duration-[var(--duration-instant)] ease-[var(--ease-route)] hover:border-border-strong md:min-h-[250px] md:gap-3 md:p-6 lg:min-h-[300px] lg:gap-3.5 lg:p-7"
              >
                <span className="flex items-center justify-between gap-4 lg:flex-col lg:items-start lg:gap-3.5">
                  <span className="text-index text-text-secondary">{String(i + 1).padStart(2, "0")}</span>
                  <ServiceIcon name={slug} />
                </span>
                <h3 className="text-card-title">{t.items[slug].title}</h3>
                <p className="text-[15px] leading-[1.6] text-text-secondary">{t.items[slug].text}</p>
                <span className="mt-auto flex items-center gap-2 pt-2 text-[15px] font-semibold max-md:hidden">
                  {t.details}
                  <Icon
                    name="arrow"
                    size={16}
                    className="transition-transform duration-[var(--duration-fast)] ease-[var(--ease-route)] group-hover/card:-translate-x-1 motion-reduce:transition-none ltr:-scale-x-100 ltr:group-hover/card:translate-x-1"
                  />
                </span>
              </Link>
            </li>
          ))}
        </Reveal>

        <Button asChild variant="secondary" className="md:hidden">
          <Link href={allHref}>{t.all}</Link>
        </Button>
      </Container>
    </Section>
  );
}
