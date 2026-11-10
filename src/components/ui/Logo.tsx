import { cn } from "@/lib/utils";

type Props = {
  /** Visible studio name next to the symbol (from the dictionary). */
  name: string;
  size?: "md" | "sm";
  className?: string;
};

/**
 * Brand lockup: the route symbol (S path, arrowhead, Signal dot — drawn from the handoff's symbol SVG, never
 * redrawn) + the studio name set in the brand font. The symbol takes the text colour, so it inverts in dark mode
 * and inside the Ink section; the dot stays Signal.
 */
export function Logo({ name, size = "md", className }: Props) {
  const md = size === "md";
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <svg viewBox="-5.6 2 124.3 150" width={md ? 26 : 20} height={md ? 31 : 24} aria-hidden="true" focusable="false">
        <path
          d="M36 139H60A31 31 0 0 0 60 77A31 31 0 0 1 60 15H94"
          fill="none"
          stroke="currentColor"
          strokeWidth="26"
        />
        <path d="M93.5 2L118.7 15L93.5 28Z" fill="currentColor" />
        <circle cx="7.4" cy="139" r="13" fill="var(--accent-signal)" />
      </svg>
      <span className={cn("font-semibold whitespace-nowrap", md ? "text-[20px]" : "text-[17px]")}>{name}</span>
    </span>
  );
}
