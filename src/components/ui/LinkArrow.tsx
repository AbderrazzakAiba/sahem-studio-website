import Link from "next/link";
import type { ComponentProps } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type Props = ComponentProps<typeof Link>;

/**
 * Text link with a reading-direction arrow (handoff › Link / Arrow, motion M-22).
 * The arrow points forward: ← in Arabic, → in English/French; it nudges 4px forward on hover.
 * The text carries the meaning — the arrow is decorative.
 */
export function LinkArrow({ className, children, ...props }: Props) {
  return (
    <Link
      className={cn(
        "group/la inline-flex min-h-11 items-center gap-2 font-semibold text-text-primary underline-offset-4 hover:underline",
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      <Icon
        name="arrow"
        size={18}
        className="transition-transform duration-[var(--duration-fast)] ease-[var(--ease-route)] group-hover/la:-translate-x-1 motion-reduce:transition-none ltr:-scale-x-100 ltr:group-hover/la:translate-x-1"
      />
    </Link>
  );
}
