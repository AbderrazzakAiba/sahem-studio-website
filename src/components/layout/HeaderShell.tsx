"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Sticky header behaviour (motion spec M-02): scrolling down past 120px hides it, any scroll up shows it.
 * It never hides while the mobile menu is open or while focus is inside it; with reduced motion it always stays.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const down = y > lastY;
      const keep =
        reduce.matches ||
        y <= 120 ||
        document.documentElement.hasAttribute("data-menu-open") ||
        !!ref.current?.contains(document.activeElement);
      if (Math.abs(y - lastY) > 4 || keep) setHidden(!keep && down);
      lastY = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      ref={ref}
      onFocus={() => setHidden(false)}
      className={cn(
        "sticky top-0 z-(--z-sticky) border-b border-border-subtle backdrop-blur-[var(--blur-header)]",
        "bg-[color-mix(in_srgb,var(--bg-page)_92%,transparent)]",
        "transition-transform duration-[var(--duration-base)] ease-[var(--ease-route)] motion-reduce:transition-none",
        hidden && "-translate-y-full",
      )}
    >
      {children}
    </header>
  );
}
