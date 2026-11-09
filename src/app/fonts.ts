import localFont from "next/font/local";

/**
 * Brand fonts, self-hosted from the approved handoff (06-assets/fonts, OFL licence).
 * Three weights only: 400 / 500 / 600 (decision D-028). Total stays under the 160 KB budget.
 * The CSS variables are combined into --font-arabic / --font-latin in globals.css.
 */
export const readexArabic = localFont({
  variable: "--font-readex-arabic",
  display: "swap",
  preload: true,
  src: [
    { path: "./fonts/readex-pro-arabic-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/readex-pro-arabic-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/readex-pro-arabic-600-normal.woff2", weight: "600", style: "normal" },
  ],
});

export const readexLatin = localFont({
  variable: "--font-readex-latin",
  display: "swap",
  preload: false,
  src: [
    { path: "./fonts/readex-pro-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/readex-pro-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/readex-pro-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
});

export const sora = localFont({
  variable: "--font-sora",
  display: "swap",
  preload: true,
  src: [
    { path: "./fonts/sora-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/sora-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/sora-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
});

export const fontVariables = `${readexArabic.variable} ${readexLatin.variable} ${sora.variable}`;
