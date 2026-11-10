import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { serviceSlugs, type ServiceSlug } from "@/content/home";
import { localizedPath, type Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
  /** Accessible name of the section ("Services list"). */
  label: string;
  details: string;
  /** Name + one-line description of each service (shared with the home page). */
  items: Record<ServiceSlug, { title: string; text: string }>;
  /** Three key words per service. */
  tags: Record<ServiceSlug, string[]>;
};

/**
 * The six services as rows, each one link to its page (handoff services screen).
 *  - Desktop: number · icon · name + line · three tags · "View service".
 *  - Tablet: number · icon · then name, tags and link stacked in the third column.
 *  - Mobile: number and icon on one line, then name, line and link (no tags).
 * Rows reveal one after another on scroll (M-10); the arrow nudges forward on hover (M-22).
 */
export function ServiceList({ locale, label, details, items, tags }: Props) {
  return (
    <Section aria-label={label} className="pt-2 md:pt-6">
      <Container>
        <Reveal as="ul" stagger className="border-t border-border-subtle">
          {serviceSlugs.map((slug, i) => (
            <li key={slug} className="border-b border-border-subtle">
              <Link
                href={localizedPath(`/services/${slug}`, locale)}
                className="group/row flex flex-col gap-2.5 py-5.5 md:grid md:grid-cols-[48px_44px_minmax(0,1fr)] md:items-center md:gap-x-6 md:gap-y-3 md:py-7 lg:grid-cols-[64px_56px_minmax(0,1.1fr)_minmax(0,1.4fr)_140px] lg:gap-7 lg:py-8"
              >
                <span className="flex items-center justify-between md:contents">
                  <span className="text-index text-text-secondary">{String(i + 1).padStart(2, "0")}</span>
                  <ServiceIcon name={slug} className="md:size-10 lg:size-12" />
                </span>
                <span className="flex flex-col gap-2 md:col-start-3">
                  <span className="text-[20px] leading-[1.4] font-semibold md:text-[clamp(22px,19px+0.76vw,30px)]">
                    {items[slug].title}
                  </span>
                  <span className="text-[15px] leading-[1.6] text-text-secondary md:text-[16px]">
                    {items[slug].text}
                  </span>
                </span>
                <span className="flex flex-wrap gap-2 max-md:hidden md:col-start-3 lg:col-start-auto">
                  {tags[slug].map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex min-h-8 items-center rounded-pill border-[1.5px] border-border-subtle px-3 text-[13px] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </span>
                <span className="flex items-center gap-2 text-[15px] font-semibold md:col-start-3 lg:col-start-auto lg:justify-end">
                  {details}
                  <Icon
                    name="arrow"
                    size={16}
                    className="transition-transform duration-[var(--duration-fast)] ease-[var(--ease-route)] group-hover/row:-translate-x-1 motion-reduce:transition-none ltr:-scale-x-100 ltr:group-hover/row:translate-x-1"
                  />
                </span>
              </Link>
            </li>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
