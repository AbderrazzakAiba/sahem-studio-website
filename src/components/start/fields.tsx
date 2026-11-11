import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Error line under a field: error colour, icon, linked with aria-describedby. */
export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <span id={id} className="flex items-center gap-1.5 text-[13px] leading-[1.5] font-medium text-(--feedback-error)">
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className="size-4 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <circle cx="8" cy="8" r="6.5" />
        <path d="M8 4.5V9M8 11V11.5" strokeLinecap="round" />
      </svg>
      {children}
    </span>
  );
}

const inputClass =
  "w-full border border-(--input-border) bg-(--input-bg) px-4 text-[16px] text-text-primary transition-colors duration-[var(--duration-instant)] hover:border-(--input-border-hover) aria-invalid:border-(--input-border-error) aria-invalid:shadow-[inset_0_0_0_1px_var(--input-border-error)]";

type TextFieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string | null;
  multiline?: boolean;
} & Omit<ComponentProps<"input">, "id"> &
  Pick<ComponentProps<"textarea">, "rows">;

/** Labelled text input (or textarea) with optional hint and error, 56px high (handoff › Input). */
export function TextField({ id, label, hint, error, multiline = false, className, rows, ...props }: TextFieldProps) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-[15px] font-medium">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          rows={rows ?? 3}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className={cn(inputClass, "min-h-28 resize-y py-3 leading-[1.6]")}
          {...(props as ComponentProps<"textarea">)}
        />
      ) : (
        <input
          id={id}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className={cn(inputClass, "h-14")}
          {...props}
        />
      )}
      {hint ? (
        <span id={`${id}-hint`} className="text-[13px] text-text-secondary">
          {hint}
        </span>
      ) : null}
      {error ? <FieldError id={`${id}-error`}>{error}</FieldError> : null}
    </div>
  );
}

/** One option of a radio group, styled as a full-width row (handoff › Radio row). Native input underneath. */
export function RadioRow({
  name,
  value,
  checked,
  onChange,
  children,
  invalid,
  describedBy,
  id,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  children: ReactNode;
  invalid?: boolean;
  describedBy?: string;
  id?: string;
}) {
  return (
    <label
      className={cn(
        "flex min-h-14 cursor-pointer items-center gap-3 border border-(--input-border) bg-(--input-bg) px-4 text-[16px] transition-colors duration-[var(--duration-instant)] hover:border-(--input-border-hover)",
        "has-[:checked]:border-border-strong has-[:checked]:font-semibold has-[:checked]:shadow-[inset_0_0_0_1px_var(--border-strong)] has-[[data-invalid]]:border-(--input-border-error)",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-(--focus-ring)",
      )}
    >
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        aria-describedby={describedBy}
        data-invalid={invalid ? "" : undefined}
        className="grid size-5 shrink-0 cursor-pointer appearance-none place-items-center rounded-dot border-[1.5px] border-(--input-border) outline-none before:size-2.5 before:scale-0 before:rounded-dot before:bg-text-primary before:transition-transform before:content-[''] checked:border-border-strong checked:before:scale-100"
      />
      <span>{children}</span>
    </label>
  );
}
