/**
 * Motion tokens — shared by every animation (library: Motion for React, https://motion.dev).
 * Values come from the handoff motion spec (05-motion/motion-spec.md); the library replaces GSAP (D-007)
 * at the manager's request.
 *
 * Rules from the handoff:
 *  - Animate transform / opacity only (one SVG pathLength / stroke-dashoffset at a time is the documented exception).
 *  - One easing for all movement: route = cubic-bezier(0.7, 0, 0.2, 1). No bounce, no spring overshoot.
 *  - prefers-reduced-motion → content appears in its final state, nothing pins, nothing moves
 *    (handled globally by <MotionProvider reducedMotion="user">; check useReducedMotion() for scroll effects).
 *  - Pinned / scroll-scrubbed effects only from 1024px up (CSS position: sticky + useScroll).
 *
 * How the GSAP spec maps to Motion:
 *  - gsap.to / from        → <m.div initial animate transition>
 *  - ScrollTrigger reveal  → whileInView + viewport={viewport}
 *  - ScrollTrigger scrub   → useScroll({ target }) + useTransform(scrollYProgress, …)
 *  - ScrollTrigger pin     → a tall wrapper + position: sticky child, driven by useScroll
 *  - stagger               → variants with transition.staggerChildren
 */

/** The brand curve, as Motion's cubic-bezier array. */
export const easeRoute = [0.7, 0, 0.2, 1] as const;
export const easeLinear = "linear" as const;

/** Durations in seconds (tokens --duration-* in tokens.css are the same values in ms). */
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

/** Distances in px (tokens --move-*). */
export const move = { sm: 8, md: 16, lg: 32 } as const;

/** Default transition for every animated element (set once in MotionProvider). */
export const defaultTransition = { ease: easeRoute, duration: durations.slow } as const;

/** Reveal-on-scroll: play once, when ~20% of the element is visible. */
export const viewport = { once: true, amount: 0.2 } as const;

/** Media query for scroll-pinned effects (desktop only, motion allowed). */
export const pinMedia = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
