import { Reveal } from "@/components/motion/Reveal";
import { Arrowhead, ProcessTimeline } from "@/components/route/ProcessTimeline";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/utils";

export type RouteStep = {
  title: string;
  text: string;
  /** Pill under the text (what you get, or the duration). */
  chip: string;
};

/** Station circle shared by the three layouts below. */
const nodeClass = "absolute size-(--route-node-size) rounded-dot border-[3px] border-route-line bg-route-node";

/**
 * The four stations of the route (handoff Process on home, "The route" on service pages).
 *  - Desktop: one horizontal track (Signal start → arrowhead) drawn with the scroll (M-11), 4 columns.
 *  - Tablet: 2 × 2, each row joined by its own line; the first station is Signal.
 *  - Mobile: a list whose stations sit on the page rail itself.
 */
export function RouteSteps({ steps }: { steps: RouteStep[] }) {
  return (
    <ProcessTimeline steps={steps.length}>
      <Reveal as="ol" stagger className="grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 lg:grid-cols-4 lg:gap-6">
        {steps.map((step, i) => (
          <li
            key={step.title}
            className="relative flex flex-col gap-2 pb-9 last:pb-0 md:gap-2.5 md:pt-9 md:pb-0 lg:pt-11"
          >
            <span
              aria-hidden="true"
              data-step-node=""
              className={cn(
                nodeClass,
                // mobile: centred on the page rail, out in the margin
                "end-[calc(var(--rail-x)_+_var(--route-stroke)/2_-_var(--route-node-size)/2_-_var(--page-margin))] top-1",
                "md:start-0 md:end-auto md:top-0 md:z-[1] lg:start-10",
                i === 0 && "md:max-lg:border-accent-signal md:max-lg:bg-accent-signal",
              )}
            />
            {/* tablet: line from this station to the next one in the row, or to the arrowhead */}
            {i % 2 === 0 ? (
              <span
                aria-hidden="true"
                className="absolute start-[19px] -end-8 top-2 hidden h-[3px] bg-route-line md:max-lg:block"
              />
            ) : null}
            {i === steps.length - 1 ? (
              <>
                <span
                  aria-hidden="true"
                  className="absolute start-[19px] end-3.5 top-2 hidden h-[3px] bg-route-line md:max-lg:block"
                />
                <Arrowhead className="absolute end-0 top-[1.5px] hidden size-4 md:max-lg:block" />
              </>
            ) : null}

            <span className="text-index text-text-secondary">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="text-card-title">{step.title}</h3>
            <p className="text-[15px] leading-[1.6] text-text-secondary">{step.text}</p>
            <Tag className="mt-1">{step.chip}</Tag>
          </li>
        ))}
      </Reveal>
    </ProcessTimeline>
  );
}
