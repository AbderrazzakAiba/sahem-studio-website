import { serviceSlugs, type ServiceSlug } from "@/content/home";

/**
 * The "Start your project" brief — one shape shared by the form (browser) and the server action.
 * The server never trusts the browser: `parseBrief` rebuilds the brief from scratch, keeping only known values
 * and trimmed strings within the limits below.
 */
export const budgetKeys = ["low", "mid", "high", "unknown"] as const;
export const timingKeys = ["asap", "month", "quarter", "undecided"] as const;
export const methodKeys = ["whatsapp", "email", "call"] as const;

export type BudgetKey = (typeof budgetKeys)[number];
export type TimingKey = (typeof timingKeys)[number];
export type MethodKey = (typeof methodKeys)[number];

export type Brief = {
  services: ServiceSlug[];
  budget: BudgetKey | null;
  timing: TimingKey | null;
  date: string;
  name: string;
  reach: string;
  method: MethodKey | null;
  message: string;
};

export const emptyBrief: Brief = {
  services: [],
  budget: null,
  timing: null,
  date: "",
  name: "",
  reach: "",
  method: null,
  message: "",
};

export const limits = { name: 80, reach: 120, date: 80, message: 1000 } as const;

export type Field = "services" | "budget" | "timing" | "name" | "reach" | "method";

/** Fields checked on each step (0-based). */
export const stepFields: Field[][] = [["services"], ["budget"], ["timing"], ["name", "method", "reach"]];

/** What the contact field asks for, depending on the chosen method (null until a method is chosen). */
export const reachKind = (method: MethodKey | null): "email" | "phone" | null =>
  method === "email" ? "email" : method ? "phone" : null;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Phone: digits with optional +, spaces, dots, dashes or brackets; 9–15 digits in total. */
const phoneRe = /^\+?[\d\s().-]+$/;

export const isEmail = (v: string) => emailRe.test(v.trim());
export const isPhone = (v: string) =>
  phoneRe.test(v.trim()) && (v.match(/\d/g)?.length ?? 0) >= 9 && (v.match(/\d/g)?.length ?? 0) <= 15;

/** Fields of the given step that are not filled in correctly. */
export function invalidFields(brief: Brief, step: number): Field[] {
  return stepFields[step].filter((field) => {
    switch (field) {
      case "services":
        return brief.services.length === 0;
      case "budget":
        return brief.budget === null;
      case "timing":
        return brief.timing === null;
      case "name":
        return brief.name.trim().length === 0;
      case "reach": {
        // asked only once a method is chosen: an email for "email", a phone number for WhatsApp or a call
        const kind = reachKind(brief.method);
        if (!kind) return false;
        return kind === "email" ? !isEmail(brief.reach) : !isPhone(brief.reach);
      }
      case "method":
        return brief.method === null;
    }
  });
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const oneOf = <T extends string>(v: unknown, keys: readonly T[]) => (keys.includes(v as T) ? (v as T) : null);

/** Rebuilds a brief from untrusted input. Returns null when it is incomplete or invalid. */
export function parseBrief(input: unknown): Brief | null {
  if (!input || typeof input !== "object") return null;
  const o = input as Record<string, unknown>;
  const services = Array.isArray(o.services)
    ? [...new Set(o.services.filter((s): s is ServiceSlug => serviceSlugs.includes(s as ServiceSlug)))]
    : [];
  const brief: Brief = {
    services,
    budget: oneOf(o.budget, budgetKeys),
    timing: oneOf(o.timing, timingKeys),
    date: str(o.date, limits.date),
    name: str(o.name, limits.name),
    reach: str(o.reach, limits.reach),
    method: oneOf(o.method, methodKeys),
    message: str(o.message, limits.message),
  };
  const ok = stepFields.every((_, step) => invalidFields(brief, step).length === 0);
  return ok ? brief : null;
}
