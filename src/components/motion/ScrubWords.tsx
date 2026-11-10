"use client";

import { useScroll, useTransform, type MotionValue } from "motion/react";
import * as m from "motion/react-m";
import { useRef, useSyncExternalStore } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

type Props = { id: string; lines: string[]; className?: string };

/**
 * Statement whose words light up with the scroll (handoff M-12): each word's opacity goes 0.15 → 1 in turn
 * while the heading moves from 80% to 35% of the viewport. Split by word only (never by letter — Arabic letters
 * join). The full text stays in the heading for assistive tech; the server render is fully opaque, and so is
 * the reduced-motion version.
 */
export function ScrubWords({ id, lines, className }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduce = usePrefersReducedMotion();
  // false on the server and during hydration, true after: the server HTML stays fully opaque.
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "start 35%"] });

  const animate = mounted && !reduce;

  const words = lines.map((line) => line.split(/\s+/).filter(Boolean));
  const total = words.flat().length;
  let index = 0;

  return (
    <h2 ref={ref} id={id} className={className}>
      {words.map((lineWords, li) => (
        <span key={li} className="block">
          {lineWords.map((word, wi) => {
            const i = index++;
            return (
              <span key={wi}>
                {animate ? <Word progress={scrollYProgress} index={i} total={total} text={word} /> : word}
                {wi < lineWords.length - 1 ? " " : null}
              </span>
            );
          })}
        </span>
      ))}
    </h2>
  );
}

const noop = () => () => {};

function Word({
  progress,
  index,
  total,
  text,
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
  text: string;
}) {
  // Each word gets its own slice of the scroll, overlapping the next one slightly.
  const start = (index / total) * 0.85;
  const opacity = useTransform(progress, [start, start + 0.15 + 0.85 / total], [0.15, 1]);
  return <m.span style={{ opacity }}>{text}</m.span>;
}
