import type { Metadata } from "next";
import { Suspense } from "react";
import { fontVariables } from "@/app/fonts";
import { MotionProvider } from "@/components/motion-provider";
import { LocalizedNotFound } from "@/components/sections/LocalizedNotFound";
import { defaultLocale, localeInfo, locales } from "@/lib/i18n";
import { jsFlagScript } from "@/lib/motion";
import { modeScript } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = { robots: { index: false, follow: true } };

/**
 * Before first paint: set <html lang/dir> from the URL (/en/…, /fr/… — else Arabic). The page frame is static
 * (prerendered once), so it cannot know the visitor's language on its own.
 */
const localeScript = `(function(){var s=location.pathname.split('/')[1];var l=${JSON.stringify(
  Object.fromEntries(locales.map((l) => [l, localeInfo[l].dir])),
)};if(l[s]){document.documentElement.lang=s;document.documentElement.dir=l[s]}})();`;

/**
 * The site's 404 (experimental globalNotFound — our root layout sits under [lang], so Next.js needs a page that
 * stands on its own). It renders for any address that matches no page and for notFound() calls (an unknown
 * service or project), with the regular header and footer, light/dark mode and fonts.
 * The proxy passes the visitor's locale in `x-sahem-locale`; reading it is request-time data, so the content
 * renders inside <Suspense> (Cache Components) while the frame is prerendered.
 */
export default function GlobalNotFound() {
  return (
    <html lang={defaultLocale} dir={localeInfo[defaultLocale].dir} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: localeScript + modeScript + jsFlagScript }} />
      </head>
      <body>
        <MotionProvider>
          <Suspense fallback={<div className="min-h-svh" />}>
            <LocalizedNotFound />
          </Suspense>
        </MotionProvider>
      </body>
    </html>
  );
}
