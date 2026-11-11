"use client";

import { useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import * as m from "motion/react-m";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { Container } from "@/components/ui/Container";
import { pinMedia } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

type Props = {
  /** Accessible name of the gallery region. */
  label: string;
  /** Accessible name of the progress slider ("Gallery position"). */
  sliderLabel: string;
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
 * Dragging (mouse / pen): the projects can be dragged sideways, and the progress line is a slider that can be
 * dragged, clicked or moved with the arrow keys. Both go through one position (0 → 1): when pinned it maps to the
 * page scroll (so pinning, line and projects stay in step); otherwise to the gallery's own horizontal scroll.
 * Touch keeps the native swipe.
 */
export function WorkGallery({ label, sliderLabel, rtl, heading, footer, children }: Props) {
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

  /** Gallery position, 0 (start) → 1 (end). */
  const getPosition = () => progress.get();
  const setPosition = (p: number, smooth = false) => {
    const value = Math.min(1, Math.max(0, p));
    const behavior: ScrollBehavior = smooth && !reduce ? "smooth" : "instant";
    if (pinned && outer.current) {
      const top = outer.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + value * overflow.get(), behavior });
    } else if (track.current) {
      const max = track.current.scrollWidth - track.current.clientWidth;
      track.current.scrollTo({ left: (rtl ? -1 : 1) * value * max, behavior });
    }
  };

  // Drag the projects with a mouse or pen. The content follows the pointer in both directions:
  // new position = start position + horizontal movement × reading direction ÷ overflow.
  const drag = useRef<{ id: number; x: number; p: number; moved: boolean } | null>(null);
  const [dragging, setDragging] = useState(false);
  const onPointerDown = (e: PointerEvent<HTMLUListElement>) => {
    if (e.pointerType === "touch" || e.button !== 0 || overflow.get() <= 0) return;
    drag.current = { id: e.pointerId, x: e.clientX, p: getPosition(), moved: false };
  };
  const onPointerMove = (e: PointerEvent<HTMLUListElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId || !track.current) return;
    const dx = e.clientX - d.x;
    if (!d.moved) {
      if (Math.abs(dx) < 6) return; // a click, not a drag
      d.moved = true;
      track.current.setPointerCapture(e.pointerId);
      track.current.style.scrollSnapType = "none";
      setDragging(true);
    }
    setPosition(d.p + (dx * dir) / overflow.get());
  };
  const endDrag = (e: PointerEvent<HTMLUListElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    if (track.current) {
      track.current.style.scrollSnapType = "";
      if (track.current.hasPointerCapture(e.pointerId)) track.current.releasePointerCapture(e.pointerId);
    }
    setDragging(false);
    // keep `moved` until the click that follows the release has been swallowed
    if (!d.moved) drag.current = null;
  };
  const onClickCapture = (e: MouseEvent<HTMLUListElement>) => {
    if (drag.current?.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
    drag.current = null;
  };

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
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onClickCapture={onClickCapture}
              onDragStart={(e) => e.preventDefault()}
              data-dragging={dragging ? "" : undefined}
              style={pinned ? { x } : undefined}
              className={cn(
                "flex flex-col gap-10 md:flex-row md:gap-5 lg:gap-6",
                "md:cursor-grab md:data-dragging:cursor-grabbing md:data-dragging:select-none",
                !pinned &&
                  "md:snap-x md:snap-mandatory md:[scrollbar-width:none] md:overflow-x-auto md:overscroll-x-contain motion-reduce:md:[scrollbar-width:auto] md:[&::-webkit-scrollbar]:hidden",
              )}
            >
              {children}
            </m.ul>
          </div>

          {/* keyed by its start: a new start (resize) remounts the line so it is drawn right away, before any scroll */}
          <ProgressLine
            key={visible.toFixed(3)}
            progress={progress}
            start={visible}
            rtl={rtl}
            label={sliderLabel}
            onSeek={setPosition}
          />
          {footer}
        </Container>
      </div>
    </div>
  );
}

/**
 * Route progress line — also a slider: grey track, white route from `start` to 100%, Signal dot at its tip.
 * Drag or click it to move through the projects; arrow keys step, Home / End jump. The arrows follow the reading
 * direction (in Arabic, ← moves forward).
 */
function ProgressLine({
  progress,
  start,
  rtl,
  label,
  onSeek,
}: {
  progress: MotionValue<number>;
  start: number;
  rtl: boolean;
  label: string;
  onSeek: (p: number, smooth?: boolean) => void;
}) {
  const bar = useRef<HTMLDivElement>(null);
  const fill = useTransform(progress, (p) => start + (1 - start) * p);
  const dotX = useTransform(fill, (f) => `${(rtl ? -1 : 1) * f * 100}%`);
  const [now, setNow] = useState(0);
  useMotionValueEvent(progress, "change", (p) => setNow(Math.round(p * 100)));

  // Pointer position along the line (from the reading start) → gallery position.
  const seekTo = (clientX: number) => {
    const r = bar.current?.getBoundingClientRect();
    if (!r || r.width === 0) return;
    const along = (rtl ? r.right - clientX : clientX - r.left) / r.width;
    onSeek((along - start) / (1 - start));
  };
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    seekTo(e.clientX);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) seekTo(e.clientX);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = 0.2;
    const forward = rtl ? "ArrowLeft" : "ArrowRight";
    const back = rtl ? "ArrowRight" : "ArrowLeft";
    const p = progress.get();
    let next: number | null = null;
    if (e.key === forward || e.key === "ArrowDown") next = p + step;
    else if (e.key === back || e.key === "ArrowUp") next = p - step;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = 1;
    if (next === null) return;
    e.preventDefault();
    onSeek(next, true);
  };

  return (
    <div
      ref={bar}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-orientation="horizontal"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={now}
      aria-valuetext={`${now}%`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onKeyDown={onKeyDown}
      className="group/bar relative h-5 cursor-pointer touch-none select-none max-md:hidden lg:h-[22px]"
    >
      {/* taller invisible hit area */}
      <span aria-hidden="true" className="absolute inset-x-0 -inset-y-3" />
      <span className="absolute inset-x-0 top-2 h-(--route-stroke) bg-border-subtle" />
      <m.span
        style={{ scaleX: fill }}
        className="absolute inset-x-0 top-2 h-(--route-stroke) bg-route-line ltr:origin-left rtl:origin-right"
      />
      <m.span style={{ x: dotX }} className="absolute inset-x-0 top-0">
        <span className="absolute -start-[9px] top-px size-[18px] rounded-dot bg-accent-signal transition-transform duration-[var(--duration-fast)] group-hover/bar:scale-125 lg:-start-[11px] lg:top-0 lg:size-[21px]" />
      </m.span>
    </div>
  );
}
