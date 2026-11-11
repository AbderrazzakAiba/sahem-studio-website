import "server-only";
import { site } from "@/content/site";
import type { Brief } from "@/lib/brief";
import { isEmail } from "@/lib/brief";

/**
 * Sends a brief to the studio's mailbox through Resend (https://resend.com), from the server only.
 *
 * Configuration (Vercel › Settings › Environment Variables — never in the repo):
 *  - RESEND_API_KEY  required to send. Without it nothing is sent (local / preview without a key) and the
 *                    function returns "skipped".
 *  - BRIEF_TO        optional, defaults to the studio email (site.email).
 *  - BRIEF_FROM      optional, defaults to Resend's test sender, which can only deliver to the Resend
 *                    account's own address — create the Resend account with the studio email. Once the
 *                    domain is verified in Resend, set e.g. "Sahem Studio <brief@sahem.studio>".
 */
export type DeliveryResult = "sent" | "skipped" | "failed";

type Labels = {
  services: string[];
  budget: string;
  timing: string;
  method: string;
  locale: string;
};

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function deliverBrief(brief: Brief, labels: Labels): Promise<DeliveryResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[brief] RESEND_API_KEY is not set — brief not sent (preview mode).");
    return "skipped";
  }

  const rows: [string, string][] = [
    ["Name", brief.name],
    ["Email / phone", brief.reach],
    ["Preferred contact", labels.method],
    ["Services", labels.services.join(", ")],
    ["Budget", labels.budget],
    ["Timing", labels.timing],
    ["Important date", brief.date || "—"],
    ["Message", brief.message || "—"],
    ["Language", labels.locale],
  ];
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `<table cellpadding="6" style="font-family:sans-serif;font-size:14px;border-collapse:collapse">${rows
    .map(
      ([k, v]) =>
        `<tr><th align="left" style="border-bottom:1px solid #ddd">${escape(k)}</th><td style="border-bottom:1px solid #ddd;white-space:pre-wrap">${escape(v)}</td></tr>`,
    )
    .join("")}</table>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.BRIEF_FROM || "Sahem Studio <onboarding@resend.dev>",
        to: [process.env.BRIEF_TO || site.email],
        reply_to: isEmail(brief.reach) ? brief.reach : undefined,
        subject: `New brief — ${brief.name.replace(/[\r\n]+/g, " ")}`,
        text,
        html,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error("[brief] Resend error", res.status, await res.text().catch(() => ""));
      return "failed";
    }
    return "sent";
  } catch (error) {
    console.error("[brief] Resend request failed", error);
    return "failed";
  }
}
