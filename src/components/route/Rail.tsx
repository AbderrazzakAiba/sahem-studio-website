import { cn } from "@/lib/utils";

/**
 * The signature route line running down a section (handoff › Route, D-018).
 * It lives in its own lane at the inline end (left in Arabic, right in English/French) — sections are
 * `relative overflow-hidden`, so each section draws its own segment and the line reads as one continuous rail.
 * Stroke and lane follow the tokens: --route-stroke (5/4/3px) and --rail-x. Decorative only.
 */
export function Rail({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("absolute inset-y-0 end-(--rail-x) w-(--route-stroke) bg-route-line", className)}
    />
  );
}
