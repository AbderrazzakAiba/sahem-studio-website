import "server-only";
import type { Brief } from "@/lib/brief";
import { sendEmail } from "@/lib/server/mail";
import { sendToTelegram } from "@/lib/server/telegram";

/** Per channel: "off" = not configured (its secrets are not set), "sent", or "failed" (configured, didn't go). */
export type ChannelResult = "sent" | "off" | "failed";
export type DeliveryResult = "sent" | "skipped" | "failed";

export type BriefLabels = {
  services: string[];
  budget: string;
  timing: string;
  method: string;
  locale: string;
};

/**
 * Sends a brief through every configured channel at once — Telegram (the team's group) and email (Resend) —
 * and calls it delivered when at least one got it, so one service being down doesn't lose the brief.
 * When no channel is configured: "failed" on the live site (VERCEL_ENV=production), so the visitor sees
 * "couldn't send — email us" instead of a false confirmation; "skipped" locally and on preview links, so the
 * flow can still be reviewed end to end.
 */
export async function deliverBrief(brief: Brief, labels: BriefLabels): Promise<DeliveryResult> {
  const results = await Promise.all([sendToTelegram(brief, labels), sendEmail(brief, labels)]);
  if (results.includes("sent")) return "sent";
  if (results.includes("failed")) return "failed";
  if (process.env.VERCEL_ENV === "production") {
    console.error("[brief] no delivery channel is configured on production — visitor told to email us.");
    return "failed";
  }
  console.warn("[brief] no delivery channel is configured — brief not sent (preview mode).");
  return "skipped";
}
