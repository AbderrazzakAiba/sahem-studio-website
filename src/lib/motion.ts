"use client";

/**
 * Motion setup — GSAP + ScrollTrigger (handoff decisions D-007, D-029; spec in 05-motion/motion-spec.md).
 *
 * Rules from the handoff:
 *  - Animate transform / opacity only (one SVG stroke-dashoffset at a time is the documented exception).
 *  - One easing for all movement: "route" = cubic-bezier(0.7, 0, 0.2, 1). No bounce, no overshoot.
 *  - GSAP loads after first paint (dynamic import) — it never blocks LCP.
 *  - prefers-reduced-motion → content appears in its final state, nothing pins, nothing moves.
 *  - Pinning only from 1024px up.
 *
 * Licence: GSAP "Standard no-charge licence" (https://gsap.com/standard-license), plugins included.
 * Use inside components with useGSAP() from "@gsap/react" so animations are cleaned up on unmount/route change.
 */

export const durations = {
  instant: 0.1,
  fast: 0.16,
  base: 0.24,
  hit: 0.3,
  slow: 0.4,
  slower: 0.7,
  route: 1.4,
} as const;

export const stagger = { sm: 0.06, md: 0.09 } as const;

export const media = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
  pin: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
} as const;

type GsapBundle = {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
};

let loading: Promise<GsapBundle> | null = null;

/** Loads GSAP + ScrollTrigger + the "route" ease once, on demand (after first paint). */
export function loadGsap(): Promise<GsapBundle> {
  loading ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("gsap/CustomEase")]).then(
    ([g, st, ce]) => {
      g.gsap.registerPlugin(st.ScrollTrigger, ce.CustomEase);
      ce.CustomEase.create("route", "0.7,0,0.2,1");
      g.gsap.defaults({ ease: "route", duration: durations.slow });
      return { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger };
    },
  );
  return loading;
}
