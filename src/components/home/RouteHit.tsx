"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useAnimate } from "motion/react-mini";
import { useEffect, useState } from "react";
import { durations, easeRoute } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * The route's final hit on "Start your project" (handoff M-18, "one hit per page"): arrowhead + line + the
 * corner up into the rail, and the Signal burst. Decorative.
 *
 * When the CTA reaches 55% of the viewport, once: the rail comes down (scaleY) and turns → the line runs to the
 * button (scaleX) → the arrowhead strikes (x 20px → 0) → the three dashes burst (scale 0 → 1) and the button's
 * Signal dot pulses (1 → 1.6 → 1). Hidden start states: styles/motion.css (JS + motion allowed only).
 * Reduced motion: drawn complete, no pulse.
 */
export function RouteHit() {
  const [scope, animate] = useAnimate<HTMLSpanElement>();
  // Plays once the hit has passed 55% of the viewport — read from the scroll position, so a fast scroll that
  // jumps past it (or a page restored further down) still triggers it.
  const { scrollYProgress } = useScroll({ target: scope, offset: ["start 55%", "end 55%"] });
  const [inView, setInView] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (p > 0) setInView(true);
  });
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    const root = scope.current;
    if (!inView || !root) return;
    if (reduce) {
      root.setAttribute("data-done", "");
      return;
    }
    const q = (name: string) => root.querySelector<HTMLElement | SVGElement>(`[data-hit="${name}"]`)!;
    // The arrow travels toward the button: rightward in Arabic, leftward in English/French.
    const from = getComputedStyle(root).direction === "rtl" ? -20 : 20;
    const dot = root.parentElement?.querySelector<HTMLElement>('[data-slot="button"] > [aria-hidden="true"]');
    const ease = easeRoute;

    // The leg is 4000px tall and clipped by the section; draw only the visible part (section top → corner).
    const ext = q("ext");
    const section = root.closest("section");
    if (section) {
      const visible = q("corner").getBoundingClientRect().top - section.getBoundingClientRect().top;
      ext.style.height = `${Math.max(0, visible)}px`;
    }

    (async () => {
      await Promise.all([
        animate(ext, { transform: ["scaleY(0)", "scaleY(1)"] }, { duration: durations.slow, ease }),
        animate(q("corner"), { opacity: [0, 1] }, { duration: durations.slow, ease }),
      ]);
      await animate(q("line"), { transform: ["scaleX(0)", "scaleX(1)"] }, { duration: durations.slow, ease });
      await animate(
        q("arrow"),
        { opacity: [0, 1], transform: [`translateX(${from}px)`, "translateX(0px)"] },
        { duration: durations.fast, ease },
      );
      await Promise.all([
        animate(q("dashes"), { transform: ["scale(0)", "scale(1)"] }, { duration: durations.hit, ease }),
        dot
          ? animate(dot, { transform: ["scale(1)", "scale(1.6)", "scale(1)"] }, { duration: durations.hit, ease })
          : null,
      ]);
      ext.style.height = "";
      root.setAttribute("data-done", "");
    })();
  }, [inView, reduce, animate, scope]);

  return (
    <span
      ref={scope}
      aria-hidden="true"
      data-hit-root=""
      className="relative -me-[calc(var(--page-margin)/2)] flex w-13 shrink-0 items-center md:w-auto md:min-w-30 md:flex-[1_1_120px]"
    >
      <span data-hit="arrow" className="flex shrink-0">
        <svg
          viewBox="0 0 26 26"
          preserveAspectRatio="none"
          focusable="false"
          className="h-[18px] w-4 md:size-[26px] ltr:-scale-x-100"
        >
          <path d="M26 13L0 1V25Z" className="fill-route-line" />
        </svg>
      </span>
      <span data-hit="line" className="h-(--route-stroke) flex-1 bg-route-line ltr:origin-right rtl:origin-left" />
      <span
        data-hit="corner"
        className="relative size-5 shrink-0 -translate-y-[calc((20px_-_var(--route-stroke))/2)] rounded-ee-[20px] border-e-(length:--route-stroke) border-b-(length:--route-stroke) border-route-line md:size-10 md:-translate-y-[calc((40px_-_var(--route-stroke))/2)] md:rounded-ee-[40px]"
      >
        <span
          data-hit="ext"
          className="absolute -end-(--route-stroke) bottom-full h-[4000px] w-(--route-stroke) origin-top bg-route-line"
        />
      </span>
      <span data-hit="dashes" className="absolute -start-4 top-1/2 z-[2] -mt-5.5 flex md:-start-6 md:-mt-7">
        <svg viewBox="0 0 24 56" focusable="false" className="h-11 w-4 md:h-14 md:w-6 ltr:-scale-x-100">
          <path d="M4 14L12 6M6 28H18M4 42L12 50" fill="none" strokeWidth={3} className="stroke-accent-signal" />
        </svg>
      </span>
    </span>
  );
}
