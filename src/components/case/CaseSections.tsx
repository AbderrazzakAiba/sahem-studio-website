import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { RouteStart } from "@/components/route/RouteStart";
import { Breadcrumb, type Crumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { Tag } from "@/components/ui/Tag";
import type { CaseMetric, CaseQuote } from "@/content/cases";
import type { Locale } from "@/lib/i18n";

type EyebrowCopy = { eyebrow: string; latin: string };

/** A project image filling its frame; `position` picks the crop (object-position). */
function Frame({
  src,
  alt,
  ratio,
  position = "50% 50%",
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  ratio: string;
  position?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden border border-border-subtle bg-bg-raised ${ratio} ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={900}
        unoptimized
        priority={priority}
        draggable={false}
        style={{ objectPosition: position }}
        className="size-full object-cover"
      />
    </div>
  );
}

/**
 * Case study opening (handoff case screen): breadcrumb, eyebrow "Case study 01", the title (h1) rising out of
 * its mask, the lead, the facts (client · sector · services · year; 4 / 2 columns), then the route starts.
 */
export function CaseHero({
  breadcrumb,
  eyebrow,
  title,
  lead,
  facts,
}: {
  breadcrumb: { items: Crumb[]; label: string };
  eyebrow: { label: string; latin: string };
  title: string;
  lead: string;
  facts: { label: string; value: ReactNode }[];
}) {
  return (
    <Section rail={false} aria-labelledby="page-title" className="pt-[clamp(16px,3vw,40px)] pb-[clamp(24px,4vw,64px)]">
      <Container className="flex flex-col gap-5 md:gap-8">
        <Breadcrumb items={breadcrumb.items} label={breadcrumb.label} />
        <Eyebrow label={eyebrow.label} latin={eyebrow.latin} className="hero-fade" />
        <h1 id="page-title" className="max-w-[1100px] text-[clamp(36px,22px+3.6vw,80px)] leading-[1.2] font-semibold">
          <span className="hero-line block overflow-hidden pb-[0.08em]">
            <span className="block">{title}</span>
          </span>
        </h1>
        <p className="hero-fade max-w-[620px] text-lead text-text-secondary" style={{ "--i": 1 } as CSSProperties}>
          {lead}
        </p>
        <dl
          className="hero-fade grid grid-cols-2 gap-x-4 gap-y-5 border-t border-border-subtle pt-5 md:gap-8 md:pt-6 lg:grid-cols-4"
          style={{ "--i": 2 } as CSSProperties}
        >
          {facts.map((fact) => (
            <div key={fact.label} className="flex flex-col gap-2">
              <dt className="text-[14px] text-text-secondary">{fact.label}</dt>
              <dd className="text-[17px] leading-[1.5] font-medium md:text-[18px]">{fact.value}</dd>
            </div>
          ))}
        </dl>
        <RouteStart />
      </Container>
    </Section>
  );
}

/** The large project image right under the opening, on the rail (no station). 4:5 on phones, 16:9 above. */
export function CaseCover({ src, alt, label }: { src: string; alt: string; label: string }) {
  return (
    <Section node={false} aria-label={label} className="pt-0">
      <Container>
        <Frame src={src} alt={alt} ratio="aspect-[4/5] md:aspect-[16/9]" priority />
      </Container>
    </Section>
  );
}

/**
 * A chapter of the story (01 The challenge · 02 The approach): eyebrow + title on one side, the text on the
 * other (1 : 1.6), stacked below 1024px. `children` adds content under the chapter (the image gallery).
 */
export function CaseChapter({
  id,
  eyebrow,
  title,
  paragraphs,
  chips,
  children,
}: {
  id: string;
  eyebrow: EyebrowCopy;
  title: string;
  paragraphs: string[];
  chips?: string[];
  children?: ReactNode;
}) {
  return (
    <Section aria-labelledby={id}>
      <Container className="flex flex-col gap-10 md:gap-14">
        <div className="grid items-start gap-6 md:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
          <Reveal stagger className="flex flex-col gap-3 md:gap-4">
            <Eyebrow label={eyebrow.eyebrow} latin={eyebrow.latin} />
            <h2 id={id} className="text-title">
              {title}
            </h2>
          </Reveal>
          <Reveal stagger className="flex flex-col gap-5">
            {paragraphs.map((p) => (
              <p
                key={p}
                className="max-w-[680px] text-[clamp(16px,15.26px+0.19vw,18px)] leading-[1.75] text-text-secondary"
              >
                {p}
              </p>
            ))}
            {chips ? (
              <ul className="flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <li key={chip}>
                    <Tag>{chip}</Tag>
                  </li>
                ))}
              </ul>
            ) : null}
          </Reveal>
        </div>
        {children}
      </Container>
    </Section>
  );
}

/** Gallery under the approach: one wide image (21:9; 4:3 on phones), three 4:5 images, a caption. */
export function CaseGallery({
  images,
  caption,
}: {
  images: {
    key: { src: string; alt: string; position: string };
    small: { src: string; alt: string; position: string }[];
  };
  caption: string;
}) {
  return (
    <figure className="flex flex-col gap-4 md:gap-6">
      <Reveal stagger className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-3">
        <Frame {...images.key} ratio="aspect-[4/3] md:aspect-[21/9]" className="col-span-full" />
        {images.small.map((img, i) => (
          <Frame key={img.alt} {...img} ratio="aspect-[4/5]" className={i === 2 ? "max-lg:hidden" : ""} />
        ))}
      </Reveal>
      <figcaption className="max-w-[680px] text-[15px] leading-[1.6] text-text-secondary">{caption}</figcaption>
    </figure>
  );
}

/**
 * 03 · The result (Ink section): the outcome in words, as a statement. Verified numbers, when a real project has
 * them, appear underneath (3 / 2 / 1 columns) with what they measure and their source.
 */
export function CaseResult({
  eyebrow,
  statement,
  metrics,
  locale,
}: {
  eyebrow: EyebrowCopy;
  statement: string;
  metrics?: CaseMetric[];
  locale: Locale;
}) {
  return (
    <Section ink aria-labelledby="result-title">
      <Container className="flex flex-col gap-10 md:gap-14">
        <Reveal stagger className="flex flex-col gap-4 md:gap-5">
          <Eyebrow label={eyebrow.eyebrow} latin={eyebrow.latin} />
          <h2
            id="result-title"
            className="max-w-[1100px] text-[clamp(32px,20px+3.2vw,72px)] leading-[1.25] font-semibold"
          >
            {statement}
          </h2>
        </Reveal>
        {metrics?.length ? (
          <Reveal as="ul" stagger className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {metrics.map((m) => (
              <li key={m.value} className="flex flex-col gap-2.5 border-t-2 border-border-strong pt-5">
                <b lang="en" className="font-latin text-[clamp(40px,30px+2.6vw,72px)] leading-[1.05] font-semibold">
                  {m.value}
                </b>
                <span className="text-[16px] text-text-primary">{m.label[locale]}</span>
                <span className="text-[13px] text-text-secondary">{m.source[locale]}</span>
              </li>
            ))}
          </Reveal>
        ) : null}
      </Container>
    </Section>
  );
}

/** "In their words" — only rendered for a real quote given with written consent. */
export function CaseQuoteBlock({ eyebrow, quote, locale }: { eyebrow: EyebrowCopy; quote: CaseQuote; locale: Locale }) {
  return (
    <Section aria-label={eyebrow.eyebrow}>
      <Container className="flex flex-col gap-6 md:gap-7">
        <Eyebrow label={eyebrow.eyebrow} latin={eyebrow.latin} />
        <figure className="flex max-w-[1000px] flex-col gap-6">
          <blockquote className="text-[clamp(26px,22px+1.5vw,44px)] leading-[1.5] font-medium">
            «{quote.text[locale]}»
          </blockquote>
          <figcaption className="flex flex-col gap-0.5">
            <b className="text-[17px]">{quote.name}</b>
            <span className="text-[15px] text-text-secondary">{quote.role[locale]}</span>
          </figcaption>
        </figure>
      </Container>
    </Section>
  );
}

/** "Next project" — one large link to the following case study (image beside the name; stacked on phones). */
export function NextProject({
  eyebrow,
  href,
  name,
  tags,
  cta,
  image,
}: {
  eyebrow: EyebrowCopy;
  href: string;
  name: string;
  tags: string[];
  cta: string;
  image: { src: string; alt: string };
}) {
  return (
    <Section aria-labelledby="next-title">
      <Container className="flex flex-col gap-6 md:gap-7">
        <Eyebrow label={eyebrow.eyebrow} latin={eyebrow.latin} />
        <Link
          href={href}
          className="group/next grid items-center gap-6 border-y border-border-subtle py-6 md:gap-8 md:py-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-12"
        >
          <span className="flex flex-col gap-3.5">
            <h2 id="next-title" className="text-heading">
              {name}
            </h2>
            <span className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </span>
            <span className="flex items-center gap-2 text-[17px] font-semibold">
              {cta}
              <Icon
                name="arrow"
                size={18}
                className="transition-transform duration-[var(--duration-fast)] ease-[var(--ease-route)] group-hover/next:-translate-x-1 motion-reduce:transition-none ltr:-scale-x-100 ltr:group-hover/next:translate-x-1"
              />
            </span>
          </span>
          <Frame src={image.src} alt={image.alt} ratio="aspect-[16/10]" />
        </Link>
      </Container>
    </Section>
  );
}
