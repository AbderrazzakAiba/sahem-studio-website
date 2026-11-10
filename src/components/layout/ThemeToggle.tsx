"use client";

import { useSyncExternalStore } from "react";
import { Icon } from "@/components/ui/Icon";
import { getMode, setMode, type Mode } from "@/lib/theme";
import { cn } from "@/lib/utils";

type Props = {
  labels: { toDark: string; toLight: string };
  className?: string;
};

// html[data-mode] is the single source of truth (set before paint by the inline script in the root layout).
const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
const getServerSnapshot = (): Mode => "light";

/**
 * Light/dark switch — the manager's addition (not in the handoff). Ghost icon button, 44px target:
 * shows a moon in light mode and a sun in dark mode; the label says what pressing it does.
 */
export function ThemeToggle({ labels, className }: Props) {
  const mode = useSyncExternalStore(subscribe, getMode, getServerSnapshot);
  const next: Mode = mode === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => {
        setMode(next);
        listeners.forEach((l) => l());
      }}
      aria-label={next === "dark" ? labels.toDark : labels.toLight}
      title={next === "dark" ? labels.toDark : labels.toLight}
      className={cn(
        "inline-grid size-11 place-items-center text-text-primary transition-colors duration-[var(--duration-instant)] hover:text-text-secondary",
        className,
      )}
    >
      <Icon name={mode === "dark" ? "sun" : "moon"} size={20} />
    </button>
  );
}
