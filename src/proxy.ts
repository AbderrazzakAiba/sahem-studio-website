import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n";

/**
 * Locale routing (Next.js 16 "Proxy", formerly Middleware).
 *  /en/... and /fr/...   → served as-is
 *  /ar/...               → redirected to the unprefixed URL (Arabic lives at /), so each page has one address
 *  everything else       → rewritten internally to /ar/...
 * Every request carries its locale in the `x-sahem-locale` header, so pages rendered outside the [lang] tree
 * (the global 404) still speak the visitor's language.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";

  if (first === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  const headers = new Headers(request.headers);
  headers.set("x-sahem-locale", isLocale(first) ? first : defaultLocale);

  if (isLocale(first)) return NextResponse.next({ request: { headers } });

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  // Skip Next internals, API routes and any file with an extension (fonts, images, icons, robots.txt…).
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
