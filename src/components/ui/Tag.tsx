import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = { children: ReactNode; className?: string };

/** Pill label (handoff › Tag / Chip): 1.5px border, non-interactive. Filter chips are buttons — not this. */
export function Tag({ children, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center self-start rounded-pill border-[1.5px] border-border-strong px-3 text-[13px] font-medium",
        className,
      )}
    >
      {children}
    </span>
  );
}
