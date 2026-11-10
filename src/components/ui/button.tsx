import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

/**
 * Brand button (handoff 03-components › Button). Square corners.
 *  - primary: Ink fill, Paper text, 8–10px Signal dot before the label (`dot`). Inverts inside data-theme="ink"
 *    and in dark mode through the tokens.
 *  - secondary: 1.5px Ink outline (inset), fills Ink on hover.
 *  - sizes: lg 72px · md 56px (default) · sm 48px.
 *  - motion M-21: colour 100ms, press scale 0.98 (no movement with reduced motion).
 * Use <a> for navigation (`asChild` with <Link>), <button> for actions.
 */
const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-3 font-semibold whitespace-nowrap select-none",
    "transition-[background-color,color,box-shadow,transform] duration-[var(--duration-instant)] ease-[var(--ease-route)]",
    "active:scale-[0.98] motion-reduce:active:scale-100",
    "disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40",
  ],
  {
    variants: {
      variant: {
        primary: "bg-button-primary-bg text-button-primary-text hover:bg-button-primary-bg-hover",
        secondary:
          "text-text-primary shadow-[inset_0_0_0_1.5px_var(--button-secondary-border)] hover:bg-button-primary-bg hover:text-button-primary-text",
      },
      size: {
        lg: "min-h-18 px-9 text-[18px]",
        md: "min-h-14 px-7 text-[17px]",
        sm: "min-h-12 px-5.5 text-[15px] gap-2.5",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    /** Signal dot before the label — primary actions only. */
    dot?: boolean;
  };

function Button({ className, variant, size, asChild = false, dot = false, children, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp data-slot="button" className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {dot ? <SignalDot /> : null}
      {asChild ? <Slot.Slottable>{children}</Slot.Slottable> : children}
    </Comp>
  );
}

function SignalDot({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("size-2 shrink-0 rounded-dot bg-accent-signal", className)} />;
}

export { Button, buttonVariants, SignalDot };
