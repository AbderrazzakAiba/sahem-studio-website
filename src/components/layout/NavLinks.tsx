"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { pathWithoutLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export type NavLink = { href: string; label: string; path: string };

type Props = { links: NavLink[]; label: string; className?: string };

/**
 * Desktop navigation (≥ 901px). The current section shows a 6px Signal dot, weight 600 and aria-current="page".
 * `path` is the locale-free path used to detect the current page; `href` is the localized URL.
 */
export function NavLinks({ links, label, className }: Props) {
  const current = pathWithoutLocale(usePathname() ?? "/");
  return (
    <nav aria-label={label} className={cn("items-center gap-9", className)}>
      {links.map((link) => {
        const active = current === link.path || current.startsWith(`${link.path}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className="relative inline-flex min-h-11 items-center gap-2 text-[16px] text-text-primary hover:text-text-secondary aria-[current=page]:font-semibold"
          >
            {active ? <span aria-hidden="true" className="size-1.5 rounded-dot bg-accent-signal" /> : null}
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
