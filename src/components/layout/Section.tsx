import type { ComponentPropsWithoutRef } from "react";
import { Node } from "@/components/route/Node";
import { Rail } from "@/components/route/Rail";
import { cn } from "@/lib/utils";

type Props = ComponentPropsWithoutRef<"section"> & {
  /** Draw this section's segment of the route rail (default true). */
  rail?: boolean;
  /** Put a station on the rail at the section's start (default true, needs `rail`). */
  node?: boolean;
  /** The Ink section (handoff: Work, the page's peak). Colours flip through data-theme="ink". */
  ink?: boolean;
};

/**
 * A page section on the route: vertical padding from --section-padding, its own rail segment and station.
 * Sections are `relative overflow-clip`, so rails and route pieces never leak into neighbours. `clip` (not
 * `hidden`) keeps the section from becoming a scroll container, so position: sticky still works inside it
 * (the pinned Work gallery).
 * Content goes inside a <Container>.
 */
export function Section({ rail = true, node = true, ink = false, className, children, ...props }: Props) {
  return (
    <section
      data-theme={ink ? "ink" : undefined}
      className={cn("relative overflow-clip py-(--section-padding)", ink && "bg-bg-page text-text-primary", className)}
      {...props}
    >
      {rail ? <Rail /> : null}
      {rail && node ? <Node ink={ink} /> : null}
      {children}
    </section>
  );
}
