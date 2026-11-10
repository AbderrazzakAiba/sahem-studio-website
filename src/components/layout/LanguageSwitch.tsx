"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { localeInfo, localizedPath, locales, pathWithoutLocale, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Props = { locale: Locale; label: string; className?: string };

/**
 * One language button that opens a short list (AR · FR · EN). Keeps the same page in the other language
 * (/work ↔ /fr/work). Disclosure pattern: Esc, outside click or tabbing away closes it; focus returns to the button.
 * The current language carries the 6px Signal dot used for "current" across the site.
 */
export function LanguageSwitch({ locale, label, className }: Props) {
  const pathname = usePathname() ?? "/";
  const rest = pathWithoutLocale(pathname);
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={wrap}
      className={cn("relative", className)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${label}: ${localeInfo[locale].name}`}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-11 items-center gap-1.5 border border-transparent px-2.5 font-latin text-[13px] font-semibold tracking-[0.14em] text-text-primary transition-colors duration-[var(--duration-instant)] hover:border-border-subtle aria-expanded:border-border-subtle"
      >
        <Icon name="globe" size={18} />
        <span lang={locale} className="[&:lang(ar)]:font-arabic [&:lang(ar)]:text-[15px] [&:lang(ar)]:tracking-normal">
          {localeInfo[locale].short}
        </span>
        <Icon
          name="chevron"
          size={14}
          className={cn("transition-transform duration-[var(--duration-fast)]", open && "rotate-180")}
        />
      </button>

      <ul
        id={listId}
        hidden={!open}
        className="absolute end-0 top-[calc(100%+8px)] z-(--z-menu) min-w-46 border border-border-subtle bg-bg-raised p-1.5 shadow-[var(--shadow-overlay)]"
      >
        {locales.map((l) => (
          <li key={l}>
            <Link
              href={localizedPath(rest, l)}
              lang={l}
              hrefLang={localeInfo[l].hreflang}
              aria-current={l === locale ? "true" : undefined}
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center justify-between gap-4 px-3 text-[15px] font-medium text-text-primary hover:bg-bg-sunken aria-[current=true]:font-semibold"
            >
              <span className="flex items-center gap-2.5">
                {l === locale ? <span aria-hidden="true" className="size-1.5 rounded-dot bg-accent-signal" /> : null}
                {localeInfo[l].name}
              </span>
              <span className="font-latin text-[11px] font-semibold tracking-[0.14em] text-text-secondary [&:lang(ar)]:font-arabic">
                {localeInfo[l].short}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
