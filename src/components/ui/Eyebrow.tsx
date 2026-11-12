import { cn } from "@/lib/utils";

type Props = {
  label: string;
  /** Arabic pages pair the label with a Latin caption (e.g. "WHY SAHEM"); empty in English/French. */
  latin?: string;
  className?: string;
};

/**
 * Small label above a section title (handoff › Eyebrow).
 * Arabic: label + tracked Latin caption. English/French: one tracked uppercase label.
 */
export function Eyebrow({ label, latin, className }: Props) {
  if (latin) {
    return (
      <p
        className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] font-medium md:text-[16px]", className)}
      >
        <span>{label}</span>
        <span lang="en" dir="ltr" className="text-[12px] font-semibold tracking-[0.2em] text-text-secondary">
          {latin}
        </span>
      </p>
    );
  }
  return (
    <p
      className={cn(
        "flex min-h-6 items-center text-[12px] font-semibold tracking-[0.18em] text-text-secondary uppercase md:text-[13px]",
        className,
      )}
    >
      {label}
    </p>
  );
}
