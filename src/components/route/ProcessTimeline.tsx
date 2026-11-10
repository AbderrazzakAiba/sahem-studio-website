"use client";

import { useMotionValueEvent, useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useCompleteWhenReduced, usePrefersReducedMotion } from "@/lib/use-reduced-motion";

type Props = { steps: number; children: ReactNode };

/**
 * Desktop process track (handoff M-11, ≥1024px): as the timeline scrolls from 80% to 47% of the viewport, the
 * line draws from the reading start (scaleX 0 → 1), each station appears as the line reaches it
 * (data-reached → styles/motion.css) and the arrowhead fades in at the end.
 * Tablet / mobile show the stations without the line. Reduced motion: drawn complete.
 */
export function ProcessTimeline({ steps, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "start 47%"] });
  const scaleX = useCompleteWhenReduced(scrollYProgress);
  const arrowOpacity = useCompleteWhenReduced(useTransform(scrollYProgress, [0.9, 1], [0, 1]));
  const [reached, setReached] = useState(0);

  // Station i (0-based) sits at i / (steps - 1) of the line.
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const n = p <= 0 ? 0 : Math.min(steps, Math.floor(p * (steps - 1) + 1e-6) + 1);
    setReached(n);
  });

  return (
    <div ref={ref} data-timeline="" data-reached={reduce ? steps : reached} className="relative">
      <m.span
        aria-hidden="true"
        style={{ scaleX }}
        className="absolute start-2.5 end-5 top-2 h-(--route-stroke) bg-route-line max-lg:hidden ltr:origin-left rtl:origin-right"
      />
      <span
        aria-hidden="true"
        className="absolute -start-2 -top-px size-[22px] rounded-dot bg-accent-signal max-lg:hidden"
      />
      <m.span aria-hidden="true" style={{ opacity: arrowOpacity }} className="max-lg:hidden">
        <Arrowhead className="absolute end-0 top-0 size-[22px]" />
      </m.span>
      {children}
    </div>
  );
}

/** Points forward along the route: left in Arabic, right in English/French. */
export function Arrowhead({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 22 22" aria-hidden="true" focusable="false" className={cn("ltr:-scale-x-100", className)}>
      <path d="M22 1L0 11L22 21Z" className="fill-route-line" />
    </svg>
  );
}
