import Link from "next/link";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { notFoundCopy } from "@/content/notFound";
import { navItems, startHref } from "@/content/site";
import { localizedPath, type Locale } from "@/lib/i18n";

/**
 * 404 — "Lost your way?" (handoff 404 screens). The route leaves the Signal dot, breaks into pieces and fades
 * into a dashed line (M-26, styles/motion.css); then the way home and three other ways back.
 * Rendered by app/global-not-found.tsx, which passes the visitor's language.
 */
export function NotFoundView({ lang }: { lang: Locale }) {
  const c = notFoundCopy[lang];

  const links = [
    ...navItems.map((item) => ({ href: item.href, label: c.links[item.key] })),
    { href: startHref, label: c.links.start },
  ];

  return (
    <main id="main" aria-labelledby="nf-title" className="pt-[clamp(40px,6vw,96px)] pb-[clamp(56px,7vw,112px)]">
      <Container className="flex flex-col gap-6 md:gap-8">
        <Eyebrow label={c.eyebrow} latin={c.latin} className="hero-fade [&>span:first-child]:font-latin" />
        <h1 id="nf-title" className="text-hero">
          <span className="hero-line block overflow-hidden pb-[0.08em]">
            <span className="block">{c.heading}</span>
          </span>
        </h1>

        {/* The broken route. Drawn for Arabic (right → left) and mirrored for English / French. */}
        <svg
          viewBox="0 0 1280 40"
          aria-hidden="true"
          focusable="false"
          className="block w-full overflow-visible ltr:-scale-x-100"
        >
          <circle cx="1268" cy="20" r="11" className="hero-route-dot fill-accent-signal" />
          <path
            d="M1250 20H760"
            pathLength={1}
            strokeWidth={5}
            vectorEffect="non-scaling-stroke"
            className="hero-route-path stroke-route-line"
          />
          {["M728 20H662", "M632 20H600", "M574 20H556"].map((d, i) => (
            <path
              key={d}
              d={d}
              strokeWidth={5}
              vectorEffect="non-scaling-stroke"
              className="hero-route-station stroke-route-line"
              style={{ "--i": i } as CSSProperties}
            />
          ))}
          <path
            d="M526 20H0"
            strokeWidth={5}
            strokeDasharray="10 14"
            vectorEffect="non-scaling-stroke"
            className="hero-route-station stroke-border-subtle"
            style={{ "--i": 4 } as CSSProperties}
          />
        </svg>

        <div className="flex flex-col gap-6 md:flex-row md:flex-wrap md:items-end md:justify-between md:gap-8">
          <p className="hero-fade max-w-[620px] text-lead text-text-secondary" style={{ "--i": 1 } as CSSProperties}>
            {c.lead}
          </p>
          <div className="hero-fade" style={{ "--i": 2 } as CSSProperties}>
            <Button asChild dot className="max-sm:w-full">
              <Link href={localizedPath("/", lang)}>{c.home}</Link>
            </Button>
          </div>
        </div>

        <nav
          aria-label={c.linksLabel}
          className="hero-fade flex flex-wrap gap-x-10 gap-y-1 border-t border-border-subtle pt-5 md:pt-6"
          style={{ "--i": 3 } as CSSProperties}
        >
          {links.map((link) => (
            <LinkArrow key={link.href} href={localizedPath(link.href, lang)}>
              {link.label}
            </LinkArrow>
          ))}
        </nav>
      </Container>
    </main>
  );
}
