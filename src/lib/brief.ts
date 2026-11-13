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

export const limits = { name: 60, reach: 120, date: 80, message: 1000 } as const;

export type Field = "services" | "budget" | "timing" | "name" | "reach" | "method";

/** Fields checked on each step (0-based). */
export const stepFields: Field[][] = [["services"], ["budget"], ["timing"], ["name", "method", "reach"]];

/** What the contact field asks for, depending on the chosen method (null until a method is chosen). */
export const reachKind = (method: MethodKey | null): "email" | "phone" | null =>
  method === "email" ? "email" : method ? "phone" : null;

/** Why a field is not accepted — each one has its own message in the dictionaries. */
export type Problem =
  | "required"
  | "nameShort"
  | "nameChars"
  | "emailFormat"
  | "phoneChars"
  | "phonePrefix"
  | "phoneMobile"
  | "phoneLocal"
  | "phoneLength";

/** Collapses runs of spaces and trims — how a name is kept (browser and server). */
export const cleanName = (v: string) => v.normalize("NFC").replace(/\s+/g, " ").trim();

/**
 * Name: letters of any script (Arabic, Latin…), words separated by a space, hyphen, apostrophe or dot
 * ("عبد الرزاق", "Abd-Er-Razzak", "O'Neil", "M. Amine"); no digits or symbols; at least 2 letters.
 */
const nameRe = /^[\p{L}\p{M}]+(?:[ '’.-]{1,2}[\p{L}\p{M}]+)*\.?$/u;
export function nameProblem(v: string): Problem | null {
  const name = cleanName(v);
  if (!name) return "required";
  if (!nameRe.test(name)) return "nameChars";
  return (name.match(/\p{L}/gu)?.length ?? 0) < 2 ? "nameShort" : null;
}

/** Email: one @, a usual local part, a real-looking domain with a 2–24 letter ending; 254 characters at most. */
const emailRe = /^(?!\.)(?!.*\.\.)[a-z0-9._%+-]{1,64}(?<!\.)@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/i;
export const isEmail = (v: string) => v.trim().length <= 254 && emailRe.test(v.trim());
export const emailProblem = (v: string): Problem | null => (!v.trim() ? "required" : isEmail(v) ? null : "emailFormat");

/**
 * Phone: digits, with spaces, dots, dashes or brackets between them and an optional + at the start.
 *  - Algerian, written locally (0…) or with +213 / 00213: a mobile is 10 digits starting 05, 06 or 07; a call
 *    may also be to a landline, 9 digits starting 02, 03 or 04. WhatsApp needs a mobile.
 *  - Another country (+ or 00 then its code): 8 to 15 digits in total.
 */
export function phoneProblem(v: string, method: MethodKey | null): Problem | null {
  const raw = v.trim();
  if (!raw) return "required";
  if (!/^\+?[\d\s().-]+$/.test(raw)) return "phoneChars";
  const digits = raw.replace(/\D/g, "");
  const intl = raw.startsWith("+") ? digits : digits.startsWith("00") ? digits.slice(2) : null;
  if (intl === null) return digits.startsWith("0") ? algerian(digits.slice(1), method) : "phonePrefix";
  if (intl.startsWith("213")) return algerian(intl.slice(3).replace(/^0/, ""), method);
  if (intl.startsWith("0")) return "phonePrefix";
  return intl.length >= 8 && intl.length <= 15 ? null : "phoneLength";
}
/** `n` is the national number without its leading 0. */
function algerian(n: string, method: MethodKey | null): Problem | null {
  if (/^[567]\d{8}$/.test(n)) return null;
  if (method === "call") return /^[234]\d{7}$/.test(n) ? null : "phoneLocal";
  return "phoneMobile";
}

/** Why a field of the brief is not accepted, or null when it is fine. */
export function problemOf(brief: Brief, field: Field): Problem | null {
  switch (field) {
    case "services":
      return brief.services.length === 0 ? "required" : null;
    case "budget":
      return brief.budget === null ? "required" : null;
    case "timing":
      return brief.timing === null ? "required" : null;
    case "method":
      return brief.method === null ? "required" : null;
    case "name":
      return nameProblem(brief.name);
    case "reach": {
      // asked only once a method is chosen: an email for "email", a phone number for WhatsApp or a call
      const kind = reachKind(brief.method);
      if (!kind) return null;
      return kind === "email" ? emailProblem(brief.reach) : phoneProblem(brief.reach, brief.method);
    }
  }
}

/** Fields of the given step that are not filled in correctly. */
export const invalidFields = (brief: Brief, step: number): Field[] =>
  stepFields[step].filter((field) => problemOf(brief, field) !== null);

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
    name: cleanName(str(o.name, limits.name)),
    reach: str(o.reach, limits.reach),
    method: oneOf(o.method, methodKeys),
    message: str(o.message, limits.message),
  };
  if (reachKind(brief.method) === "email") brief.reach = brief.reach.toLowerCase();
  const ok = stepFields.every((_, step) => invalidFields(brief, step).length === 0);
  return ok ? brief : null;
}
