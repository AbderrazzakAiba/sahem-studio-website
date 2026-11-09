import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n";

/**
 * Locale routing (Next.js 16 "Proxy", formerly Middleware).
 *  /en/... and /fr/...   → served as-is
 *  /ar/...               → redirected to the unprefixed URL (Arabic lives at /), so each page has one address
 *  everything else       → rewritten internally to /ar/...
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";

  if (first === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (isLocale(first)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next internals, API routes and any file with an extension (fonts, images, icons, robots.txt…).
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
