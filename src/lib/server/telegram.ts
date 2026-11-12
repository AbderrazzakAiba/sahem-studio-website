import "server-only";
import type { Brief } from "@/lib/brief";
import type { BriefLabels, ChannelResult } from "@/lib/server/deliver";

/**
 * Posts a brief to the team's Telegram group, in the "طلبات" topic, through the studio's bot (Bot API
 * sendMessage, from the server only — the token never reaches the browser).
 *
 * Configuration (Vercel › Settings › Environment Variables — never in the repo):
 *  - TELEGRAM_BOT_TOKEN  the bot's token from @BotFather. Secret.
 *  - TELEGRAM_CHAT_ID    the group's id, e.g. -1001234567890 (from a message link t.me/c/1234567890/45/67).
 *  - TELEGRAM_TOPIC_ID   optional: the topic's id (45 in that link). Without it the message goes to General.
 * Without the token or the chat id this channel is "off".
 */
export async function sendToTelegram(brief: Brief, labels: BriefLabels): Promise<ChannelResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return "off";
  const topic = Number(process.env.TELEGRAM_TOPIC_ID);

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_thread_id: Number.isInteger(topic) && topic > 0 ? topic : undefined,
        text: telegramText(brief, labels),
        parse_mode: "HTML",
        link_preview_options: { is_disabled: true },
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      // Telegram's error body never contains the token; the request URL (which does) is never logged.
      console.error("[brief] Telegram error", res.status, (await res.text().catch(() => "")).slice(0, 300));
      return "failed";
    }
    return "sent";
  } catch (error) {
    console.error("[brief] Telegram request failed", error instanceof Error ? error.name : "unknown");
    return "failed";
  }
}

/** Telegram's HTML mode needs only these three escaped; everything the visitor typed goes through it. */
const esc = (s: string) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);

/** International digits for wa.me from what the visitor typed: "0555 12 34 56" → "213555123456". */
export function waNumber(phone: string): string | null {
  const raw = phone.trim();
  let digits = raw.replace(/\D/g, "");
  if (raw.startsWith("00")) digits = digits.slice(2);
  else if (!raw.startsWith("+") && digits.startsWith("0")) digits = `213${digits.slice(1)}`;
  return digits.length >= 9 && digits.length <= 15 ? digits : null;
}

/** The message the team reads, in Arabic (the studio's working language). Telegram's limit is 4096 chars. */
export function telegramText(brief: Brief, labels: BriefLabels): string {
  const wa = brief.method === "whatsapp" ? waNumber(brief.reach) : null;
  const reach = wa ? `<a href="https://wa.me/${wa}">${esc(brief.reach)}</a>` : esc(brief.reach);
  const lines = [
    "📩 <b>طلب جديد من الموقع</b>",
    "",
    `👤 <b>الاسم:</b> ${esc(brief.name)}`,
    `📞 <b>التواصل:</b> ${esc(labels.method)} — ${reach}`,
    `🧩 <b>الخدمات:</b> ${esc(labels.services.join("، "))}`,
    `💰 <b>الميزانية:</b> ${esc(labels.budget)}`,
    `⏱ <b>الموعد:</b> ${esc(labels.timing)}${brief.date ? ` — ${esc(brief.date)}` : ""}`,
    `🌐 <b>لغة الزائر:</b> ${esc(labels.locale)}`,
  ];
  if (brief.message) lines.push("", "<b>الفكرة:</b>", esc(brief.message));
  return lines.join("\n");
}
