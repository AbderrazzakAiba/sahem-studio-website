import { NotFoundFromParams } from "@/components/sections/NotFoundFromParams";
import { getDictionary, pickChrome } from "@/lib/dictionaries";
import { locales } from "@/lib/i18n";

/**
 * 404 for notFound() thrown by a page under [lang] (an unknown service or project…), with the site's header and
 * footer in the visitor's language. Static: the header/footer words of the three languages are prepared at build
 * time and the language is picked from the URL. Unknown addresses go to app/global-not-found.tsx; both show the
 * same page. Next.js adds <meta name="robots" content="noindex">.
 */
export default async function NotFound() {
  const entries = await Promise.all(locales.map(async (l) => [l, pickChrome(await getDictionary(l))] as const));
  return (
    <NotFoundFromParams chrome={Object.fromEntries(entries) as Parameters<typeof NotFoundFromParams>[0]["chrome"]} />
  );
}
