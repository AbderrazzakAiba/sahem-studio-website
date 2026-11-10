"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

type State = "upcoming" | "current" | "passed";

type Props = {
  /**
   * Inside the Ink section the station keeps its inverted look and never turns Signal (handoff M-08 note).
   */
  ink?: boolean;
  className?: string;
};

/**
 * A station on the rail (handoff › Route): 21 / 19 / 17px circle with a 3px route-line border, centred on the
 * rail, at the section's top padding (where the section header starts). Decorative only.
 *
 * Motion M-08: while its section crosses 60% of the viewport the station is current (Signal fill); after the
 * section has passed it is ink; before, paper and scaled to 0.6 (styles/motion.css). Colour changes are kept
 * with reduced motion; the scale is not.
 */
export function Node({ ink = false, className }: Props) {
  const section = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<State>("upcoming");

  // Progress of the section (its parent) across a line at 60% of the viewport: 0 before, 1 after.
  // Read from the scroll position, so a fast jump past a section still lands on the right state.
  const { scrollYProgress } = useScroll({ target: section, offset: ["start 60%", "end 60%"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setState(p <= 0 ? "upcoming" : p >= 1 ? "passed" : "current");
  });

  return (
    <span
      ref={(el) => {
        section.current = el?.parentElement ?? null;
      }}
      aria-hidden="true"
      data-station=""
      data-state={ink ? "passed" : state}
      className={cn(
        "absolute end-[calc(var(--rail-x)_+_var(--route-stroke)/2_-_var(--route-node-size)/2)] top-[calc(var(--section-padding)_+_2px)]",
        "size-(--route-node-size) rounded-dot border-[3px] border-route-line bg-route-node",
        !ink && "data-[state=current]:border-route-node-active data-[state=current]:bg-route-node-active",
        !ink && "data-[state=passed]:bg-route-line",
        className,
      )}
    />
  );
}
