import { cn } from "@/lib/utils";

type Props = { steps: string[]; current: number };

/** Station positions along the line (from the reading start), as on the handoff screen. */
const AT = ["12%", "36%", "60%", "84%"];

/**
 * The form's route (handoff start screen, M-23): a line with one station per step. Passed stations are ink,
 * the current one is Signal with a ring, upcoming ones are hollow; the ink line grows to the current station.
 * Labels sit under the stations from tablet up; phones show the "Step 2 of 4" line instead. Decorative —
 * the step is announced in text by the form.
 */
export function StepRoute({ steps, current }: Props) {
  return (
    <div aria-hidden="true" className="relative h-6 md:h-16">
      <span className="absolute start-[11px] end-[22px] top-2.5 h-(--route-stroke) bg-border-subtle" />
      <span
        className="absolute start-[11px] top-2.5 h-(--route-stroke) bg-route-line transition-[width] duration-[var(--duration-slow)] ease-[var(--ease-route)] motion-reduce:transition-none"
        style={{ width: `calc(${AT[current]} - 11px)` }}
      />
      <span className="absolute start-0 top-[1.5px] size-[22px] rounded-dot bg-accent-signal max-md:hidden" />
      {steps.map((label, i) => (
        <span key={label}>
          <span
            className={cn(
              "absolute top-0.5 size-[21px] rounded-dot border-[3px] transition-colors duration-[var(--duration-fast)]",
              i < current && "border-route-line bg-route-line",
              i === current &&
                "border-accent-signal bg-accent-signal shadow-[0_0_0_4px_var(--bg-page),0_0_0_5.5px_var(--route-line)]",
              i > current && "border-border-subtle bg-bg-page",
            )}
            style={{ insetInlineStart: `calc(${AT[i]} - 10.5px)` }}
          />
          <span
            className={cn(
              "absolute top-10 text-[14px] whitespace-nowrap max-md:hidden ltr:-translate-x-1/2 rtl:translate-x-1/2",
              i === current ? "font-semibold text-text-primary" : "text-text-secondary",
            )}
            style={{ insetInlineStart: AT[i] }}
          >
            {label}
          </span>
        </span>
      ))}
    </div>
  );
}
