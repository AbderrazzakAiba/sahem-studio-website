"use client";

import { useMotionValue, useScroll, useTransform, type MotionValue } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef, useState, useSyncExternalStore, type FocusEvent, type ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { pinMedia } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

type Props = {
  /** Accessible name of the gallery region. */
  label: string;
  rtl: boolean;
  heading: ReactNode;
  /** Shown under the gallery (the mobile "All work" button). */
  footer: ReactNode;
  /** The project <li> items. */
  children: ReactNode;
};

const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(pinMedia);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const usePinned = () =>
  useSyncExternalStore(
    subscribe,
    () => window.matchMedia(pinMedia).matches,
    () => false,
  );

/**
 * The Work gallery (handoff M-13 — the page's peak).
 *  - Desktop ≥1024 with motion: the section pins (sticky inside a taller wrapper) and the vertical scroll moves
 *    the projects along the reading direction; the progress line grows from the visible share of the projects to 100% and the Signal dot follows.
 *    Keyboard focus on a project scrolls the page so that project comes into view.
 *  - Tablet: native horizontal swipe with scroll-snap (the next project peeks); the line follows that scroll.
 *  - Mobile: stacked projects, no line. Reduced motion: never pinned, native scrolling.
 */
export function WorkGallery({ label, rtl, heading, footer, children }: Props) {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const pinned = usePinned();
  const reduce = usePrefersReducedMotion();
  const [overflowPx, setOverflowPx] = useState(0);
  const overflow = useMotionValue(0);
  // Share of the projects visible at rest (the line's starting length; the handoff shows 34% for 3 projects).
  const [visible, setVisible] = useState(0.34);
  const pinnedMv = useMotionValue(0);

  useEffect(() => {
    pinnedMv.set(pinned ? 1 : 0);
  }, [pinned, pinnedMv]);

  // How far the projects extend past the visible width.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => {
      const o = Math.max(0, el.scrollWidth - el.clientWidth);
      overflow.set(o);
      if (el.scrollWidth > 0) setVisible(Math.min(1, el.clientWidth / el.scrollWidth));
      setOverflowPx(o);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [overflow, pinned]);

  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });
  const { scrollXProgress } = useScroll({ container: track });
  const dir = rtl ? 1 : -1;
  const x = useTransform(() => (pinnedMv.get() ? scrollYProgress.get() * overflow.get() * dir : 0));
  // RTL scroll positions are negative, so the horizontal progress is read as an absolute value.
  const progress = useTransform(() =>
    pinnedMv.get() ? scrollYProgress.get() : Math.min(1, Math.abs(scrollXProgress.get())),
  );

  const onFocus = (e: FocusEvent<HTMLUListElement>) => {
    if (!pinned || !outer.current || !track.current) return;
    const item = (e.target as HTMLElement).closest("li");
    const o = overflow.get();
    if (!item || o <= 0) return;
    const t = track.current.getBoundingClientRect();
    const r = item.getBoundingClientRect();
    const offset = rtl ? t.right - r.right : r.left - t.left; // distance from the track start (untransformed)
    const fraction = Math.min(1, Math.max(0, offset / o));
    const top = outer.current.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + fraction * o, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div ref={outer} style={pinned ? { height: `calc(100svh + ${overflowPx}px)` } : undefined}>
      <div className={cn(pinned && "sticky top-0 flex h-svh flex-col justify-center")}>
        <Container className="flex flex-col gap-7 md:gap-9 lg:gap-10">
          {heading}

          <div
            role="region"
            aria-label={label}
            tabIndex={pinned ? undefined : 0}
            className={cn("max-md:contents", pinned && "overflow-clip")}
          >
            <m.ul
              ref={track}
              onFocus={onFocus}
              style={pinned ? { x } : undefined}
              className={cn(
                "flex flex-col gap-10 md:flex-row md:gap-5 lg:gap-6",
                !pinned &&
                  "md:snap-x md:snap-mandatory md:[scrollbar-width:none] md:overflow-x-auto md:overscroll-x-contain motion-reduce:md:[scrollbar-width:auto] md:[&::-webkit-scrollbar]:hidden",
              )}
            >
              {children}
            </m.ul>
          </div>

          {/* keyed by its start: a new start (resize) remounts the line so it is drawn right away, before any scroll */}
          <ProgressLine key={visible.toFixed(3)} progress={progress} start={visible} rtl={rtl} />
          {footer}
        </Container>
      </div>
    </div>
  );
}

/** Route progress line: grey track, white route from `start` to 100%, Signal dot at its tip. Decorative. */
function ProgressLine({ progress, start, rtl }: { progress: MotionValue<number>; start: number; rtl: boolean }) {
  const fill = useTransform(progress, (p) => start + (1 - start) * p);
  const dotX = useTransform(fill, (f) => `${(rtl ? -1 : 1) * f * 100}%`);

  return (
    <div aria-hidden="true" className="relative h-5 max-md:hidden lg:h-[22px]">
      <span className="absolute inset-x-0 top-2 h-(--route-stroke) bg-border-subtle" />
      <m.span
        style={{ scaleX: fill }}
        className="absolute inset-x-0 top-2 h-(--route-stroke) bg-route-line ltr:origin-left rtl:origin-right"
      />
      <m.span style={{ x: dotX }} className="absolute inset-x-0 top-0">
        <span className="absolute -start-[9px] top-px size-[18px] rounded-dot bg-accent-signal lg:-start-[11px] lg:top-0 lg:size-[21px]" />
      </m.span>
    </div>
  );
}
