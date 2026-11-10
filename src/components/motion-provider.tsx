"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { defaultTransition } from "@/lib/motion";

// Animation features load after first paint (code-split), keeping the initial JS small (performance budget, D-029).
const loadFeatures = () => import("motion/react").then((mod) => mod.domAnimation);

/**
 * Wraps the app once (in the root layout).
 *  - `strict`: components must use the lightweight `m` elements — `import * as m from "motion/react-m"` —
 *    not `motion.div`, otherwise the bundle grows and Motion throws in development.
 *  - `reducedMotion="user"`: respects the OS "reduce motion" setting for every animation.
 *  - every animation defaults to the brand ease and the `slow` duration.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user" transition={defaultTransition}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
