import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { fontVariables } from "@/app/fonts";
import { MotionProvider } from "@/components/motion-provider";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localeInfo, localizedPath, locales } from "@/lib/i18n";
import { languageAlternates, siteUrl } from "@/lib/seo";
import { jsFlagScript } from "@/lib/motion";
import { modeScript, themeColors } from "@/lib/theme";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = await getDictionary(lang);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t.site.name, template: `%s — ${t.site.name}` },
    description: t.site.description,
    alternates: {
      canonical: localizedPath("/", lang),
      languages: languageAlternates("/"),
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
        {/* Page chrome lives in the route groups: (site) = header, footer, action bar; (focus) = the form. */}
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
