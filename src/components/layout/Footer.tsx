import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { navItems, privacyHref, site, startHref, whatsappHref } from "@/content/site";
import type { ChromeCopy } from "@/lib/dictionaries";
import { localeInfo, localizedPath, locales, type Locale } from "@/lib/i18n";

type Props = { locale: Locale; t: ChromeCopy };

const linkClass = "inline-flex min-h-11 items-center text-text-secondary hover:text-text-primary md:min-h-0";

/**
 * Site footer (handoff home screens): brand + tagline · site links · contact · follow, then copyright,
 * privacy and the other languages. Desktop: 4 columns; mobile: brand, two columns (site, follow), contact.
 * Emails, phones and handles are LTR islands inside Arabic text.
 */
export function Footer({ locale, t }: Props) {
  const wa = whatsappHref(site.whatsapp);
  const year = site.copyrightYear;

  return (
    <footer className="border-t border-border-subtle pt-12 pb-7 md:pt-16 md:pb-8">
      <Container className="flex flex-col gap-8 md:gap-12">
        <div className="grid grid-cols-2 gap-7 md:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))] md:gap-10">
          <div className="col-span-2 flex flex-col gap-2.5 md:col-span-1 md:gap-4">
            <Logo name={t.site.name} />
            <p className="max-w-80 text-[15px] leading-relaxed text-text-secondary">{t.site.tagline}</p>
          </div>

          <Column title={t.footer.site} as="nav" label={t.footer.site}>
            {navItems.map((item) => (
              <Link key={item.key} href={localizedPath(item.href, locale)} className={linkClass}>
                {t.nav[item.key]}
              </Link>
            ))}
            <Link href={localizedPath(startHref, locale)} className={linkClass}>
              {t.nav.start}
            </Link>
          </Column>

          <Column title={t.footer.contact} className="col-span-2 max-md:order-last md:col-span-1">
            <a href={`mailto:${site.email}`} className={linkClass}>
              <bdi dir="ltr" className="font-latin">
                {site.email}
              </bdi>
            </a>
            {site.phones.map((p) => (
              <a key={p.tel} href={`tel:${p.tel}`} className={linkClass}>
                <bdi dir="ltr" className="font-latin">
                  {p.display}
                </bdi>
              </a>
            ))}
            {wa ? (
              <a href={wa} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {t.contact.whatsapp}
              </a>
            ) : null}
          </Column>

          <Column title={t.footer.follow}>
            {site.socials.map((s) => (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                <bdi dir="ltr" className="font-latin">
                  {s.name}
                  {s.handle ? <span className="max-md:hidden"> · {s.handle}</span> : null}
                </bdi>
              </a>
            ))}
          </Column>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-5 text-[13px] text-text-secondary md:pt-6 md:text-[14px]">
          <span>{t.footer.copyright.replace("{year}", String(year))}</span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href={localizedPath(privacyHref, locale)} className="hover:text-text-primary">
              {t.footer.privacy}
            </Link>
            {locales
              .filter((l) => l !== locale)
              .map((l) => (
                <Link
                  key={l}
                  href={localizedPath("/", l)}
                  lang={l}
                  hrefLang={localeInfo[l].hreflang}
                  className="hover:text-text-primary [&:lang(en)]:font-latin [&:lang(fr)]:font-latin"
                >
                  {localeInfo[l].name}
                </Link>
              ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}

function Column({
  title,
  children,
  as = "div",
  label,
  className,
}: {
  title: string;
  children: ReactNode;
  as?: "div" | "nav";
  label?: string;
  className?: string;
}) {
  const Tag = as;
  return (
    <Tag aria-label={label} className={`flex flex-col gap-1 text-[15px] md:gap-2.5 ${className ?? ""}`}>
      <span className="font-semibold text-text-primary">{title}</span>
      {children}
    </Tag>
  );
}
