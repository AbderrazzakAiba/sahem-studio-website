import Link from "next/link";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

type Props = {
  /** From the home page to the current page; the last item is the current page (no link). */
  items: Crumb[];
  /** Accessible name of the navigation landmark ("Breadcrumb"). */
  label: string;
  className?: string;
};

/** Breadcrumb trail (handoff inner pages): links separated by "/", the current page marked aria-current. */
export function Breadcrumb({ items, label, className }: Props) {
  return (
    <nav aria-label={label} className={cn("text-[14px] text-text-secondary", className)}>
      <ol className="flex flex-wrap items-center gap-x-2.5">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={`${item.label}-${i}`}>
              <li className="inline-flex min-h-11 items-center">
                {item.href && !last ? (
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 min-w-11 items-center justify-center hover:text-text-primary"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current={last ? "page" : undefined}
                    className={last ? "font-medium text-text-primary" : ""}
                  >
                    {item.label}
                  </span>
                )}
              </li>
              {!last ? (
                <li aria-hidden="true" className="inline-flex items-center">
                  /
                </li>
              ) : null}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
