"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { pathWithoutLocale } from "@/lib/i18n";

type Props = {
  start: { href: string; label: string };
  whatsapp: { href: string; label: string } | null;
};

/**
 * Mobile action bar (< 768px, decision D-019): the start CTA under the thumb + a 52px WhatsApp square.
 * 72px + safe-area inset; hidden on /start (focus mode). The root layout reserves matching bottom padding.
 */
export function ActionBar({ start, whatsapp }: Props) {
  const path = pathWithoutLocale(usePathname() ?? "/");
  if (path === "/start" || path.startsWith("/start/")) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-(--z-whatsapp) flex gap-2 border-t border-border-subtle bg-[color-mix(in_srgb,var(--bg-page)_94%,transparent)] px-3 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] backdrop-blur-[var(--blur-header)] md:hidden">
      <Button asChild dot className="min-h-13 flex-1">
        <Link href={start.href}>{start.label}</Link>
      </Button>
      {whatsapp ? (
        <a
          href={whatsapp.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={whatsapp.label}
          className="inline-grid size-13 shrink-0 place-items-center text-text-primary shadow-[inset_0_0_0_1.5px_var(--border-strong)]"
        >
          <Icon name="whatsapp" />
        </a>
      ) : null}
    </div>
  );
}
