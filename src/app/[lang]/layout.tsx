import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { fontVariables } from "@/app/fonts";
import { ActionBar } from "@/components/layout/ActionBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MotionProvider } from "@/components/motion-provider";
import { site, startHref, whatsappHref } from "@/content/site";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localeInfo, localizedPath, locales } from "@/lib/i18n";
import { jsFlagScript } from "@/lib/motion";
import { modeScript, themeColors } from "@/lib/theme";
import "../globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = await getDictionary(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.site.name, template: `%s — ${t.site.name}` },
    description: t.site.description,
    alternates: {
      canonical: localizedPath("/", lang),
      languages: Object.fromEntries(locales.map((l) => [localeInfo[l].hreflang, localizedPath("/", l)])),
    },
    openGraph: {
      siteName: t.site.name,
      locale: lang,
      images: [{ url: lang === "ar" ? "/og/og-ar.png" : "/og/og-en.png", width: 1200, height: 630 }],
    },
  };
}

export const viewport: Viewport = {
  // Light by default; the theme toggle updates it (lib/theme.ts › setMode).
  themeColor: themeColors.light,
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const start = { href: localizedPath(startHref, lang), label: t.nav.start };
  const wa = whatsappHref(site.whatsapp);

  return (
    <html lang={lang} dir={localeInfo[lang].dir} className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Sets data-mode before first paint (no light/dark flash). */}
        <script dangerouslySetInnerHTML={{ __html: modeScript + jsFlagScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[999] focus:bg-bg-page focus:px-4 focus:py-3"
        >
          {t.a11y.skipToContent}
        </a>
        <MotionProvider>
          <Header locale={lang} t={t} />
          {/* Bottom padding below 768px so the fixed action bar never covers content. */}
          <div className="max-md:pb-[calc(72px+env(safe-area-inset-bottom))]">
            {children}
            <Footer locale={lang} t={t} />
          </div>
          <ActionBar start={start} whatsapp={wa ? { href: wa, label: t.contact.whatsappLabel } : null} />
        </MotionProvider>
      </body>
    </html>
  );
}
