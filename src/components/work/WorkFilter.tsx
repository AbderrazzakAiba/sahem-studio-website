"use client";

import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { WorkCard } from "@/components/work/WorkCard";
import type { featuredWork, WorkTag } from "@/content/home";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Props = {
  works: (typeof featuredWork)[number][];
  /** Filters in display order (service tags). */
  filters: WorkTag[];
  copy: Pick<Dictionary["workPage"], "filterLabel" | "all" | "filters" | "count" | "empty">;
  cards: Pick<Dictionary["home"]["work"], "items" | "tags">;
  locale: Locale;
};

/**
 * Works list with filter chips (handoff work screen): "All" + one chip per service. Chips are toggle buttons
 * (aria-pressed) in a labelled group; choosing one shows only that kind of project and the count below is
 * announced (aria-live). Cards keep their original number. Chips scroll sideways on narrow screens.
 */
export function WorkFilter({ works, filters, copy, cards, locale }: Props) {
  const [active, setActive] = useState<WorkTag | null>(null);
  const shown = active ? works.filter((w) => w.tags.includes(active)) : works;
  const rule = new Intl.PluralRules(locale).select(shown.length) as keyof typeof copy.count;
  const count = (copy.count[rule] ?? copy.count.other).replace("{n}", String(shown.length));

  const chip = (key: WorkTag | null, label: string) => {
    const pressed = active === key;
    return (
      <button
        key={key ?? "all"}
        type="button"
        aria-pressed={pressed}
        onClick={() => setActive(key)}
        className={cn(
          "inline-flex min-h-11 shrink-0 items-center rounded-pill border-[1.5px] border-border-strong px-4 text-[14px] font-medium whitespace-nowrap md:px-4.5 md:text-[15px]",
          "transition-colors duration-[var(--duration-instant)] ease-[var(--ease-route)]",
          pressed
            ? "border-button-primary-bg bg-button-primary-bg text-button-primary-text"
            : "text-text-primary hover:bg-bg-sunken",
        )}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-6 md:gap-10">
      <div className="flex flex-col gap-4">
        <div
          role="group"
          aria-label={copy.filterLabel}
          className="-mx-(--page-margin) flex [scrollbar-width:none] gap-2 overflow-x-auto px-(--page-margin) md:mx-0 md:flex-wrap md:gap-2.5 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {chip(null, copy.all)}
          {filters.map((key) => chip(key, copy.filters[key]))}
        </div>
        <p aria-live="polite" className="text-[15px] text-text-secondary">
          {count}
        </p>
      </div>

      {shown.length ? (
        <Reveal as="ul" stagger className="grid gap-12 md:grid-cols-2 md:gap-x-6 md:gap-y-10 lg:gap-x-8 lg:gap-y-14">
          {shown.map((work) => (
            <li key={work.id}>
              <WorkCard work={work} index={works.indexOf(work)} t={cards} locale={locale} headingLevel="h2" />
            </li>
          ))}
        </Reveal>
      ) : (
        <p className="py-12 text-lead text-text-secondary">{copy.empty}</p>
      )}
    </div>
  );
}
