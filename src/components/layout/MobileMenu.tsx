"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog } from "radix-ui";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { pathWithoutLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { NavLink } from "@/components/layout/NavLinks";

type Props = {
  links: NavLink[];
  start: { href: string; label: string };
  whatsapp: { href: string; label: string } | null;
  labels: { open: string; close: string; title: string; siteName: string; homeHref: string };
  className?: string;
};

/**
 * Mobile menu (≤ 900px) — handoff › Mobile menu: full-screen Ink overlay, the links drawn as stations on a route
 * line, the start CTA + WhatsApp at the bottom. Radix Dialog gives role="dialog", aria-modal, focus trap, Esc and
 * focus return to the menu button. While open, html[data-menu-open] keeps the header from hiding.
 */
export function MobileMenu({ links, start, whatsapp, labels, className }: Props) {
  const [open, setOpen] = useState(false);
  const current = pathWithoutLocale(usePathname() ?? "/");

  useEffect(() => {
    document.documentElement.toggleAttribute("data-menu-open", open);
    return () => document.documentElement.removeAttribute("data-menu-open");
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label={labels.open}
        className={cn(
          "inline-grid size-12 place-items-center text-text-primary shadow-[inset_0_0_0_1.5px_var(--border-strong)]",
          className,
        )}
      >
        <Icon name="menu" className="ltr:-scale-x-100" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Content
          data-theme="ink"
          aria-describedby={undefined}
          className={cn(
            "fixed inset-0 z-(--z-menu) flex flex-col overflow-y-auto bg-bg-page text-text-primary",
            "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:slide-in-from-top",
            "duration-[var(--duration-slow)] motion-reduce:animate-none",
          )}
        >
          <Dialog.Title className="sr-only">{labels.title}</Dialog.Title>

          <div className="flex min-h-16 items-center justify-between px-6">
            <Link href={labels.homeHref} aria-label={labels.siteName} onClick={() => setOpen(false)}>
              <Logo name={labels.siteName} size="sm" />
            </Link>
            <Dialog.Close
              aria-label={labels.close}
              className="inline-grid size-12 place-items-center shadow-[inset_0_0_0_1.5px_var(--border-strong)]"
            >
              <Icon name="close" />
            </Dialog.Close>
          </div>

          {/* Stations on the route line: the rail runs along the inline end, one node per link. */}
          <nav className="relative mx-6 mt-10 flex-1">
            <span aria-hidden="true" className="absolute inset-y-2 end-2.5 w-[var(--route-stroke)] bg-route-line" />
            <ul className="flex flex-col pe-12">
              {links.map((link) => {
                const active = current === link.path || current.startsWith(`${link.path}/`);
                return (
                  <li key={link.href} className="relative">
                    <span
                      aria-hidden="true"
                      className={cn(
                        // centred on the rail: rail centre sits 10px + stroke/2 from the nav's end edge, the li ends 48px earlier
                        "absolute end-[calc(10px_+_var(--route-stroke)/2_-_var(--route-node)/2_-_48px)] top-1/2 size-[var(--route-node)] -translate-y-1/2 rounded-dot border-[3px] border-route-line",
                        active ? "bg-route-node-active" : "bg-route-node",
                      )}
                    />
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className="flex min-h-18 items-center text-[32px] leading-tight font-semibold"
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex gap-2 px-3 py-3">
            <Button asChild dot className="flex-1" size="md">
              <Link href={start.href} onClick={() => setOpen(false)}>
                {start.label}
              </Link>
            </Button>
            {whatsapp ? (
              <a
                href={whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={whatsapp.label}
                className="inline-grid size-14 shrink-0 place-items-center shadow-[inset_0_0_0_1.5px_var(--border-strong)]"
              >
                <Icon name="whatsapp" />
              </a>
            ) : null}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
