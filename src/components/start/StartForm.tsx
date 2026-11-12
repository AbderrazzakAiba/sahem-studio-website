"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { submitBrief } from "@/app/[lang]/(focus)/start/actions";
import { FieldError, RadioRow, TextField } from "@/components/start/fields";
import { StepRoute } from "@/components/start/StepRoute";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { serviceSlugs, type ServiceSlug } from "@/content/home";
import {
  budgetKeys,
  emptyBrief,
  invalidFields,
  limits,
  methodKeys,
  reachKind,
  stepFields,
  timingKeys,
  type Brief,
  type Field,
  type MethodKey,
} from "@/lib/brief";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Props = {
  locale: Locale;
  t: Dictionary["start"];
  serviceNames: Record<ServiceSlug, string>;
  thanksHref: string;
  privacyHref: string;
  contact: { whatsapp: string | null; email: string };
};

/** id of the control each field's error points to. */
const fieldId: Record<Field, string> = {
  services: "f-service-websites",
  budget: "f-budget-low",
  timing: "f-timing-asap",
  name: "f-name",
  reach: "f-reach",
  method: "f-method-whatsapp",
};

/**
 * "Start your project" (handoff start screens, D-026): four short steps — service → budget → timing → contact —
 * one screen per step, the route advancing with each one, a running summary beside it on desktop.
 *  - Arriving from a service page (?service=slug) pre-selects that service.
 *  - "Next" checks the current step; errors sit under their fields and in a summary that takes focus,
 *    each line linking to its field. Moving between steps moves focus to the step's title and announces it.
 *  - Sending goes through a server action that validates everything again (lib/brief.ts) and e-mails the
 *    studio; a hidden field and a minimum time on the form keep simple bots out.
 */
export function StartForm({ locale, t, serviceNames, thanksHref, privacyHref, contact }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [brief, setBrief] = useState<Brief>(() => {
    const pre = params.get("service");
    return { ...emptyBrief, services: serviceSlugs.includes(pre as ServiceSlug) ? [pre as ServiceSlug] : [] };
  });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Field[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const startedAt = useRef(0);
  const trap = useRef<HTMLInputElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const summaryBox = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const total = stepFields.length;

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  // After moving to another step, put focus on its title (screen readers then read the new step).
  useEffect(() => {
    if (moved.current) heading.current?.focus();
  }, [step]);
  // Focus the error summary only right after a "Next" / "Send" attempt — never while the visitor is typing
  // (focusing on every change of `errors` pulled the cursor out of the field after each letter).
  const [attempt, setAttempt] = useState(0);
  const sendError = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (attempt) summaryBox.current?.focus();
  }, [attempt]);
  useEffect(() => {
    if (status === "error") sendError.current?.focus();
  }, [status]);
  const showErrors = (invalid: Field[]) => {
    setErrors(invalid);
    setAttempt((n) => n + 1);
  };

  const update = <K extends keyof Brief>(key: K, value: Brief[K]) => {
    setBrief((b) => ({ ...b, [key]: value }));
    // clear the error of a field once it is edited (same array when it had none: no needless re-render)
    setErrors((e) => (e.includes(key as Field) ? e.filter((f) => f !== key) : e));
  };
  const kind = reachKind(brief.method);
  const reachError = kind === "email" ? t.contact.email.error : t.contact.phone.error;
  /** Choosing the method decides the contact field; switching between email and phone clears it. */
  const chooseMethod = (method: MethodKey) => {
    const changesKind = reachKind(method) !== kind;
    setBrief((b) => ({ ...b, method, reach: changesKind ? "" : b.reach }));
    setErrors((e) =>
      e.includes("method") || (changesKind && e.includes("reach"))
        ? e.filter((f) => f !== "method" && (!changesKind || f !== "reach"))
        : e,
    );
  };

  const toggleService = (slug: ServiceSlug) =>
    update(
      "services",
      brief.services.includes(slug) ? brief.services.filter((s) => s !== slug) : [...brief.services, slug],
    );

  const go = (to: number) => {
    moved.current = true;
    setErrors([]);
    setStep(to);
  };
  const next = () => {
    const invalid = invalidFields(brief, step);
    if (invalid.length) return showErrors(invalid);
    go(step + 1);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (step < total - 1) return next();
    const invalid = invalidFields(brief, step);
    if (invalid.length) return showErrors(invalid);
    setStatus("sending");
    const res = await submitBrief(brief, {
      locale,
      trap: trap.current?.value ?? "",
      startedAt: startedAt.current,
    }).catch(() => ({ ok: false as const, error: "send" as const }));
    if (res.ok) router.push(thanksHref);
    else setStatus("error");
  };

  const errorText: Record<Field, string> = {
    services: t.service.error,
    budget: t.budget.error,
    timing: t.timing.error,
    name: t.contact.nameError,
    reach: reachError,
    method: t.contact.methodError,
  };
  const has = (f: Field) => errors.includes(f);
  const titleClass = "text-heading outline-none";
  const stepLine = `${t.stepOf.replace("{n}", String(step + 1)).replace("{total}", String(total))} · ${t.steps[step]}`;

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-20">
      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-8 md:gap-10">
        <div className="flex flex-col gap-3.5">
          <Eyebrow label={t.eyebrow} latin={t.latin} />
          <StepRoute steps={t.steps} current={step} />
          <p aria-live="polite" className="text-[14px] font-medium text-text-secondary md:sr-only">
            {stepLine}
          </p>
        </div>

        {errors.length ? (
          <div
            ref={summaryBox}
            tabIndex={-1}
            role="alert"
            className="flex flex-col gap-2 border-2 border-(--feedback-error) bg-bg-raised px-4 py-3.5 outline-none"
          >
            <FieldError id="error-summary">{t.errorSummary}</FieldError>
            <ul className="flex flex-col gap-1 ps-6">
              {errors.map((f) => (
                <li key={f}>
                  <a href={`#${fieldId[f]}`} className="text-[14px] underline underline-offset-4">
                    {errorText[f]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Hidden from people; bots that fill every field are dropped silently on the server. */}
        <div aria-hidden="true" className="absolute -start-[9999px] size-px overflow-hidden">
          <label htmlFor="f-company">{t.honeypot}</label>
          <input ref={trap} id="f-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {step === 0 ? (
          <fieldset className="flex flex-col gap-6" aria-describedby={has("services") ? "f-services-error" : undefined}>
            <legend className="contents">
              <h1 ref={heading} tabIndex={-1} className={titleClass}>
                {t.service.title}
              </h1>
            </legend>
            <p className="text-[16px] leading-[1.75] text-text-secondary md:text-[18px]">{t.service.lead}</p>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
              {serviceSlugs.map((slug) => {
                const on = brief.services.includes(slug);
                return (
                  <button
                    key={slug}
                    id={`f-service-${slug}`}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleService(slug)}
                    className={cn(
                      "flex min-h-28 flex-col items-start justify-between gap-2.5 border p-4 text-start text-[15px] font-semibold transition-colors duration-[var(--duration-instant)] md:text-[16px]",
                      on
                        ? "border-button-primary-bg bg-button-primary-bg text-button-primary-text"
                        : "border-(--input-border) bg-(--input-bg) text-text-primary hover:border-border-strong",
                    )}
                  >
                    <span className="flex w-full items-start justify-between">
                      <ServiceIcon name={slug} className="size-7 lg:size-8" />
                      <span
                        aria-hidden="true"
                        className={cn(
                          "grid size-5 place-items-center border-[1.5px]",
                          on ? "border-current" : "border-(--input-border)",
                        )}
                      >
                        {on ? <Icon name="check" size={14} /> : null}
                      </span>
                    </span>
                    {serviceNames[slug]}
                  </button>
                );
              })}
            </div>
            {has("services") ? <FieldError id="f-services-error">{t.service.error}</FieldError> : null}
          </fieldset>
        ) : null}

        {step === 1 ? (
          <fieldset className="flex flex-col gap-6">
            <legend className="contents">
              <h1 ref={heading} tabIndex={-1} className={titleClass}>
                {t.budget.title}
              </h1>
            </legend>
            <p className="text-[16px] leading-[1.75] text-text-secondary md:text-[18px]">{t.budget.lead}</p>
            <div className="flex flex-col gap-2.5">
              {budgetKeys.map((key) => (
                <RadioRow
                  key={key}
                  id={`f-budget-${key}`}
                  name="budget"
                  value={key}
                  checked={brief.budget === key}
                  onChange={(v) => update("budget", v as Brief["budget"])}
                  invalid={has("budget")}
                  describedBy={has("budget") ? "f-budget-error" : undefined}
                >
                  {t.budget.options[key]}
                </RadioRow>
              ))}
            </div>
            {has("budget") ? <FieldError id="f-budget-error">{t.budget.error}</FieldError> : null}
          </fieldset>
        ) : null}

        {step === 2 ? (
          <fieldset className="flex flex-col gap-6">
            <legend className="contents">
              <h1 ref={heading} tabIndex={-1} className={titleClass}>
                {t.timing.title}
              </h1>
            </legend>
            <div className="flex flex-col gap-2.5">
              {timingKeys.map((key) => (
                <RadioRow
                  key={key}
                  id={`f-timing-${key}`}
                  name="timing"
                  value={key}
                  checked={brief.timing === key}
                  onChange={(v) => update("timing", v as Brief["timing"])}
                  invalid={has("timing")}
                  describedBy={has("timing") ? "f-timing-error" : undefined}
                >
                  {t.timing.options[key]}
                </RadioRow>
              ))}
            </div>
            {has("timing") ? <FieldError id="f-timing-error">{t.timing.error}</FieldError> : null}
            <TextField
              id="f-date"
              label={t.timing.dateLabel}
              hint={t.timing.dateHint}
              value={brief.date}
              maxLength={limits.date}
              onChange={(e) => update("date", e.target.value)}
            />
          </fieldset>
        ) : null}

        {step === 3 ? (
          <fieldset className="flex flex-col gap-6">
            <legend className="contents">
              <h1 ref={heading} tabIndex={-1} className={titleClass}>
                {t.contact.title}
              </h1>
            </legend>
            <TextField
              id="f-name"
              label={t.contact.name}
              autoComplete="name"
              value={brief.name}
              maxLength={limits.name}
              error={has("name") ? t.contact.nameError : null}
              onChange={(e) => update("name", e.target.value)}
            />
            <fieldset className="flex flex-col gap-2.5">
              <legend className="mb-2 text-[15px] font-medium">{t.contact.method}</legend>
              {!brief.method ? (
                <p className="-mt-1 mb-1 text-[13px] text-text-secondary">{t.contact.methodHint}</p>
              ) : null}
              <div className="grid gap-2.5 sm:grid-cols-3">
                {methodKeys.map((key) => (
                  <RadioRow
                    key={key}
                    id={`f-method-${key}`}
                    name="method"
                    value={key}
                    checked={brief.method === key}
                    onChange={(v) => chooseMethod(v as MethodKey)}
                    invalid={has("method")}
                    describedBy={has("method") ? "f-method-error" : undefined}
                  >
                    {t.contact.methods[key]}
                  </RadioRow>
                ))}
              </div>
              {has("method") ? <FieldError id="f-method-error">{t.contact.methodError}</FieldError> : null}
            </fieldset>
            {kind ? (
              <TextField
                key={kind}
                id="f-reach"
                label={
                  kind === "email"
                    ? t.contact.email.label
                    : brief.method === "whatsapp"
                      ? t.contact.phone.whatsappLabel
                      : t.contact.phone.label
                }
                hint={kind === "email" ? t.contact.email.hint : t.contact.phone.hint}
                type={kind === "email" ? "email" : "tel"}
                inputMode={kind === "email" ? "email" : "tel"}
                autoComplete={kind === "email" ? "email" : "tel"}
                dir="ltr"
                className="[&_input]:font-latin [&_input]:rtl:text-right"
                value={brief.reach}
                maxLength={limits.reach}
                error={has("reach") ? reachError : null}
                onChange={(e) => update("reach", e.target.value)}
              />
            ) : null}
            <TextField
              id="f-message"
              label={t.contact.message}
              hint={t.contact.messageHint}
              multiline
              value={brief.message}
              maxLength={limits.message}
              onChange={(e) => update("message", (e.target as unknown as HTMLTextAreaElement).value)}
            />
          </fieldset>
        ) : null}

        {status === "error" ? (
          <p
            ref={sendError}
            tabIndex={-1}
            role="alert"
            className="border-2 border-(--feedback-error) bg-bg-raised px-4 py-3.5 text-[15px] outline-none"
          >
            {t.sendError.replace("{email}", contact.email)}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-6">
          <span lang="en" className="font-latin text-[13px] tracking-[0.14em]! text-text-secondary max-md:hidden">
            STEP {step + 1} / {total}
          </span>
          <div className="flex flex-1 flex-wrap justify-end gap-3 max-md:flex-col-reverse md:flex-none">
            {step > 0 ? (
              <Button type="button" variant="secondary" onClick={() => go(step - 1)} className="max-md:w-full">
                {t.previous}
              </Button>
            ) : null}
            {step < total - 1 ? (
              <Button type="button" onClick={next} className="max-md:w-full">
                {t.next}
                <Icon name="arrow" size={18} className="ltr:-scale-x-100" />
              </Button>
            ) : (
              <Button type="submit" dot disabled={status === "sending"} className="max-md:w-full">
                {status === "sending" ? t.sending : t.submit}
              </Button>
            )}
          </div>
        </div>

        <p className="text-[13px] text-text-secondary lg:hidden">
          {t.summary.privacy}{" "}
          <a href={privacyHref} className="underline underline-offset-4">
            {t.summary.privacyLink}
          </a>
        </p>
      </form>

      <aside
        aria-label={t.summary.title}
        className="flex flex-col gap-6 border border-card-border bg-card-bg p-7 max-lg:hidden lg:sticky lg:top-8"
      >
        <h2 className="text-[20px] font-semibold">{t.summary.title}</h2>
        <dl className="border-t border-border-subtle">
          {[
            [
              t.steps[0],
              new Intl.ListFormat(locale, { type: "unit" }).format(brief.services.map((s) => serviceNames[s])),
            ],
            [t.steps[1], brief.budget ? t.budget.options[brief.budget] : ""],
            [t.steps[2], [brief.timing ? t.timing.options[brief.timing] : "", brief.date].filter(Boolean).join(" · ")],
            [t.steps[3], brief.method ? t.contact.methods[brief.method] : ""],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 border-b border-border-subtle py-3.5 text-[15px]">
              <dt className="text-text-secondary">{label}</dt>
              <dd className="text-end font-semibold">{value || t.summary.empty}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-col gap-2.5">
          <span className="text-[15px] text-text-secondary">{t.summary.direct}</span>
          {contact.whatsapp ? (
            <a
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2.5 font-semibold"
            >
              <Icon name="whatsapp" />
              {t.summary.whatsapp}
            </a>
          ) : (
            <a href={`mailto:${contact.email}`} className="inline-flex min-h-11 items-center gap-2.5 font-semibold">
              {t.summary.email}
            </a>
          )}
        </div>
        <p className="border-t border-border-subtle pt-4 text-[13px] text-text-secondary">
          {t.summary.privacy}{" "}
          <a href={privacyHref} className="underline underline-offset-4">
            {t.summary.privacyLink}
          </a>
        </p>
      </aside>
    </div>
  );
}
