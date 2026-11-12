import Link from "next/link";
import { notFound } from "next/navigation";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localizedPath } from "@/lib/i18n";

/**
 * Focus mode for the start form and its thanks page (handoff D-026): no navigation, no footer, no action bar —
 * only the logo, the language switch and a way back to the site.
 */
export default async function FocusLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = await getDictionary(lang);

  return (
    <>
      <header className="border-b border-border-subtle">
        <Container className="flex min-h-16 items-center justify-between gap-4 md:min-h-22">
          <Link
            href={localizedPath("/", lang)}
            aria-label={t.a11y.homeLink}
            className="inline-flex min-h-11 items-center"
          >
            <Logo name={t.site.name} size="sm" className="md:hidden" />
            <Logo name={t.site.name} className="max-md:hidden" />
          </Link>
          <div className="flex items-center gap-2 md:gap-3">
            <LanguageSwitch locale={lang} label={t.language.label} />
            <Link
              href={localizedPath("/", lang)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 px-3 text-[14px] font-semibold shadow-[inset_0_0_0_1.5px_var(--border-strong)] hover:bg-bg-sunken md:min-h-12 md:gap-2.5 md:px-4.5 md:text-[15px]"
            >
              <Icon name="close" size={18} />
              <span className="max-sm:sr-only">{t.start.back}</span>
            </Link>
          </div>
        </Container>
      </header>
      {children}
    </>
  );
}
