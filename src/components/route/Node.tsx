import { cn } from "@/lib/utils";

type Props = {
  /** upcoming = paper fill · current = Signal fill · passed = ink fill */
  state?: "upcoming" | "current" | "passed";
  className?: string;
};

/**
 * A station on the rail (handoff › Route): 21 / 19 / 17px circle with a 3px route-line border, centred on the
 * rail. By default it sits at the section's top padding (where the section header starts); pass `className`
 * to place it elsewhere. Decorative only.
 */
export function Node({ state = "upcoming", className }: Props) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute end-[calc(var(--rail-x)_+_var(--route-stroke)/2_-_var(--route-node)/2)] top-[calc(var(--section-padding)_+_2px)]",
        "size-(--route-node) rounded-dot border-[3px] border-route-line",
        state === "upcoming" && "bg-route-node",
        state === "current" && "bg-route-node-active",
        state === "passed" && "bg-route-line",
        className,
      )}
    />
  );
}
