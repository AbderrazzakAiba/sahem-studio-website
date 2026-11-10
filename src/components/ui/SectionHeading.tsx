import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

type Props = {
  /** id of the heading, referenced by the section's aria-labelledby. */
  id: string;
  eyebrow: string;
  latin?: string;
  title: ReactNode;
  lead?: string;
  /** "title" = section title (28–36px) · "display" = statement (40–96px). */
  size?: "title" | "display";
  /** Optional link shown at the end of the heading row (e.g. "All services"), from tablet up. */
  action?: ReactNode;
  className?: string;
};

/** Eyebrow + h2 + optional lead, the opening of most sections (handoff home screens). */
export function SectionHeading({ id, eyebrow, latin, title, lead, size = "title", action, className }: Props) {
  const heading = (
    <div className="flex flex-col gap-3 md:gap-4">
      <Eyebrow label={eyebrow} latin={latin} />
      <h2 id={id} className={size === "display" ? "max-w-[1100px] text-display" : "text-title"}>
        {title}
      </h2>
      {lead ? <p className="max-w-[620px] text-lead text-text-secondary">{lead}</p> : null}
    </div>
  );

  if (!action) return <div className={className}>{heading}</div>;
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-6", className)}>
      {heading}
      <div className="max-md:hidden">{action}</div>
    </div>
  );
}
