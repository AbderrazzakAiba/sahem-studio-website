"use client";

import { useScroll } from "motion/react";
import * as m from "motion/react-m";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useCompleteWhenReduced } from "@/lib/use-reduced-motion";

/**
 * The signature route line running down a section (handoff › Route, D-018).
 * It lives in its own lane at the inline end (left in Arabic, right in English/French) — sections clip their
 * content, so each section draws its own segment and the line reads as one continuous rail.
 * Stroke and lane follow the tokens: --route-stroke (5/4/3px) and --rail-x. Decorative only.
 *
 * Motion M-07: the segment draws downward with the scroll (scaleY 0 → 1, origin top). Every segment uses the
 * same "pen" — a line at 70% of the viewport: whatever part of the rail is above it is drawn, the rest is not.
 * One shared line keeps the route continuous across section boundaries (with different start / end lines, the
 * segment above could still be unfinished while the next one had already started, which showed as a break).
 * Reduced motion: drawn complete.
 */
export function Rail({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 70%"] });
  const scaleY = useCompleteWhenReduced(scrollYProgress);

  return (
    <m.span
      ref={ref}
      aria-hidden="true"
      style={{ scaleY }}
      className={cn("absolute inset-y-0 end-(--rail-x) w-(--route-stroke) origin-top bg-route-line", className)}
    />
  );
}
