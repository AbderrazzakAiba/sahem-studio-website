"use client";

import { useMotionValue, useTransform, type MotionValue } from "motion/react";
import { useEffect, useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";

const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(query);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/**
 * true when the visitor asked the OS to reduce motion. Reads the media query directly (and follows changes),
 * so scroll-driven effects can switch to their complete state reliably — including right after hydration.
 * The server snapshot is false; the CSS start states are gated by the same media query, so nothing is
 * hidden for those visitors in the meantime.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * A scroll-driven value that sits at `complete` while reduced motion is on. It stays the same MotionValue in
 * `style` either way (Motion does not reliably reset a style that switches from a MotionValue to a number).
 */
export function useCompleteWhenReduced(value: MotionValue<number>, complete = 1): MotionValue<number> {
  const reduce = usePrefersReducedMotion();
  const reduceMv = useMotionValue(reduce ? 1 : 0);
  useEffect(() => {
    reduceMv.set(reduce ? 1 : 0);
  }, [reduce, reduceMv]);
  return useTransform(() => (reduceMv.get() ? complete : value.get()));
}
