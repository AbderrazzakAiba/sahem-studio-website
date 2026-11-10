import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Section } from "@/components/layout/Section";
import { RouteStart } from "@/components/route/RouteStart";
import { Breadcrumb, type Crumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import type { ServiceSlug } from "@/content/home";

type Props = {
  slug: ServiceSlug;
  breadcrumb: { items: Crumb[]; label: string };
  eyebrow: { label: string; latin: string };
  title: string;
  lead: string;
  start: { href: string; label: string };
  /** "Website work" — jumps to the related work further down the page. */
  seeWork: string;
  image: { src: string; alt: string };
};

/**
 * Service page opening (handoff service screen): breadcrumb, then the service (eyebrow "Service 01 / 06", icon,
 * name as h1, lead, actions) beside a 4:5 image on desktop; stacked below with a 16:9 (tablet) or 4:3 (mobile)
 * image. The route starts underneath and turns down into the rail.
 */
export function ServiceHero({ slug, breadcrumb, eyebrow, title, lead, start, seeWork, image }: Props) {
  return (
    <Section rail={false} aria-labelledby="page-title" className="pt-[clamp(16px,3vw,40px)] pb-[clamp(24px,4vw,64px)]">
      <Container className="flex flex-col gap-6 md:gap-8">
        <Breadcrumb items={breadcrumb.items} label={breadcrumb.label} />
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-end lg:gap-18">
          <div className="flex flex-col gap-5 md:gap-7">
            <Eyebrow label={eyebrow.label} latin={eyebrow.latin} className="hero-fade" />
            <ServiceIcon name={slug} className="size-14 md:size-16 lg:size-18" />
            <h1 id="page-title" className="text-display">
              <span className="hero-line block overflow-hidden pb-[0.08em]">
                <span className="block">{title}</span>
              </span>
            </h1>
            <p className="hero-fade max-w-[620px] text-lead text-text-secondary" style={{ "--i": 1 } as CSSProperties}>
              {lead}
            </p>
            <div
              className="hero-fade flex flex-col gap-3 sm:flex-row sm:flex-wrap"
              style={{ "--i": 2 } as CSSProperties}
            >
              <Button asChild dot>
                <Link href={start.href}>{start.label}</Link>
              </Button>
              <Button asChild variant="secondary">
                <a href="#work">{seeWork}</a>
              </Button>
            </div>
          </div>
          <div
            className="hero-fade aspect-[4/3] overflow-hidden border border-border-subtle bg-bg-raised md:aspect-[16/9] lg:aspect-[4/5]"
            style={{ "--i": 3 } as CSSProperties}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={1200}
              height={900}
              unoptimized
              priority
              className="size-full object-cover"
            />
          </div>
        </div>
        <RouteStart />
      </Container>
    </Section>
  );
}
