import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/utils";

type Props<T extends ElementType> = { as?: T } & ComponentPropsWithoutRef<T>;

/**
 * Page width: margin clamp(24px, 5.5vw, 80px) on each side, content max 1280px (tokens --page-margin, --content-max).
 */
export function Container<T extends ElementType = "div">({ as, className, ...props }: Props<T>) {
  const Tag = as ?? "div";
  return (
    <Tag className={cn("mx-auto w-[min(calc(100%-2*var(--page-margin)),var(--content-max))]", className)} {...props} />
  );
}
