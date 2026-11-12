"use server";

import { parseBrief } from "@/lib/brief";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";
import { deliverBrief } from "@/lib/server/deliver";

export type SubmitResult = { ok: true } | { ok: false; error: "invalid" | "send" };

/**
 * Receives the "Start your project" brief. Anti-spam: a hidden field people never fill (`trap`) and a minimum
 * time on the form; both make bots "succeed" silently, so they learn nothing. The brief is validated again
 * here, then sent to the team's Telegram group and the studio email
 * (lib/server/deliver.ts).
 */
export async function submitBrief(
  input: unknown,
  meta: { locale: string; trap: string; startedAt: number },
): Promise<SubmitResult> {
  const elapsed = Date.now() - Number(meta.startedAt);
  if (meta.trap || !Number.isFinite(elapsed) || elapsed < 3000) return { ok: true };

  const brief = parseBrief(input);
  if (!brief) return { ok: false, error: "invalid" };

  const locale = isLocale(meta.locale) ? meta.locale : "ar";
  // The studio reads briefs in Arabic, whatever language the visitor used.
  const ar = await getDictionary("ar");
  const result = await deliverBrief(brief, {
    services: brief.services.map((s) => ar.home.services.items[s].title),
    budget: ar.start.budget.options[brief.budget!],
    timing: ar.start.timing.options[brief.timing!],
    method: ar.start.contact.methods[brief.method!],
    locale,
  });

  return result === "failed" ? { ok: false, error: "send" } : { ok: true };
}
