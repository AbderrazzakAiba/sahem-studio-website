import Link from "next/link";
import { HeaderShell } from "@/components/layout/HeaderShell";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { NavLinks, type NavLink } from "@/components/layout/NavLinks";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { navItems, site, startHref, whatsappHref } from "@/content/site";
import type { ChromeCopy } from "@/lib/dictionaries";
import { localizedPath, type Locale } from "@/lib/i18n";

type Props = { locale: Locale; t: ChromeCopy };

/**
 * Site header (handoff › Header): logo · nav (≥ 901px) · language · theme · start CTA (≥ 768px) · menu (≤ 900px).
 * Heights 64 / 76 / 88 (mobile / tablet / desktop). Rendered once in the root layout.
 */
export function Header({ locale, t }: Props) {
  const links: NavLink[] = navItems.map((item) => ({
    href: localizedPath(item.href, locale),
    path: item.href,
    label: t.nav[item.key],
  }));
  const start = { href: localizedPath(startHref, locale), label: t.nav.start };
  const wa = whatsappHref(site.whatsapp);
  const homeHref = localizedPath("/", locale);

  return (
    <HeaderShell>
      <Container className="flex min-h-16 items-center justify-between gap-6 md:min-h-19 lg:min-h-22">
        <Link href={homeHref} aria-label={t.a11y.homeLink} className="inline-flex min-h-11 items-center">
          <Logo
            name={t.site.name}
            className="max-md:[&_svg]:h-6 max-md:[&_svg]:w-5 max-md:[&>span:last-child]:text-[17px]"
          />
        </Link>

        <NavLinks links={links} label={t.nav.label} className="hidden min-[901px]:flex" />

        <div className="flex items-center gap-1 md:gap-3">
          <LanguageSwitch locale={locale} label={t.language.label} />
          <ThemeToggle labels={t.theme} />
          <Button asChild dot size="sm" className="hidden md:inline-flex">
            <Link href={start.href}>{start.label}</Link>
          </Button>
          <MobileMenu
            className="min-[901px]:hidden"
            links={links}
            start={start}
            whatsapp={wa ? { href: wa, label: t.contact.whatsappLabel } : null}
            labels={{ ...t.menu, siteName: t.site.name, homeHref }}
          />
        </div>
      </Container>
    </HeaderShell>
  );
}
