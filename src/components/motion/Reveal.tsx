"use client";

import { useInView } from "motion/react";
import { useAnimate } from "motion/react-mini";
import { useEffect, type ComponentPropsWithoutRef, type ElementType } from "react";
import { durations, easeRoute, move, stagger as staggerTokens } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

type Props<T extends ElementType> = {
  as?: T;
  /** Reveal each direct child in turn (stagger-sm) instead of the element as one block. */
  stagger?: boolean;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

/**
 * Reveal on scroll, once (handoff M-09 section headers, M-10 cards): opacity 0 → 1, translateY move-md → 0,
 * duration-slow, ease-route, stagger-sm between children.
 *
 * Server-rendered content stays complete without JS: the hidden start state lives in styles/motion.css and only
 * applies under html[data-js] with motion allowed. Animations run on the compositor (WAAPI via motion/react-mini).
 */
export function Reveal<T extends ElementType = "div">({ as, stagger = false, children, ...props }: Props<T>) {
  const Tag: ElementType = as ?? "div";
  const [scope, animate] = useAnimate<HTMLElement>();
  const inView = useInView(scope, { once: true, margin: "0px 0px -12% 0px" });
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    const root = scope.current;
    if (!inView || !root) return;
    if (reduce) {
      root.setAttribute("data-revealed", "");
      return;
    }
    const targets = stagger ? Array.from(root.children) : [root];
    const runs = targets.map((el, i) =>
      animate(
        el,
        { opacity: [0, 1], transform: [`translateY(${move.md}px)`, "translateY(0px)"] },
        { duration: durations.slow, ease: easeRoute, delay: i * staggerTokens.sm },
      ),
    );
    Promise.all(runs).then(() => root.setAttribute("data-revealed", ""));
  }, [inView, reduce, stagger, animate, scope]);

  return (
    <Tag ref={scope} data-reveal={stagger ? "group" : "self"} {...props}>
      {children}
    </Tag>
  );
}
