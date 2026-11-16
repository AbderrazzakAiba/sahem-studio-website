import { serviceSlugs } from "@/content/home";
import { site, startHref, whatsappHref } from "@/content/site";
import { getDictionary } from "@/lib/dictionaries";
import { localizedPath, locales, localeInfo } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/seo";

/**
 * /llms.txt (https://llmstxt.org) — a plain summary of the studio for AI assistants and agents: who we are,
 * where, what we do, how to reach us, and the pages worth reading, in Markdown. Built from the English
 * dictionary so it always matches the site, and prerendered at build time (no request data is read).
 * The demo projects under /work are left out on purpose until real ones replace them, so no assistant
 * presents them as the studio's work.
 */
export async function GET() {
  const t = await getDictionary("en");
  const link = (label: string, path: string, note?: string) =>
    `- [${label}](${absoluteUrl(localizedPath(path, "en"))})${note ? `: ${note}` : ""}`;
  const wa = whatsappHref(site.whatsapp);

  const body = [
    `# ${t.site.name}`,
    "",
    `> ${t.site.description} Based in El Oued, Algeria, working with clients across Algeria. Arabic name: سهم ستوديو.`,
    "",
    t.processPage.about.body,
    "",
    "## Key facts",
    "- Type: creative and tech studio (design, development, content, automation)",
    "- Location: El Oued, Algeria; serves clients across Algeria",
    `- Languages: ${locales.map((l) => localeInfo[l].name).join(", ")} (the site is available in all three)`,
    `- Email: ${site.email}`,
    `- Phone / WhatsApp: ${site.phones.map((p) => p.tel).join(", ")}`,
    ...(wa ? [`- WhatsApp chat: ${wa}`] : []),
    `- Start a project (4-step brief form): ${absoluteUrl(localizedPath(startHref, "en"))}`,
    "",
    "## Services",
    ...serviceSlugs.map((slug) =>
      link(t.home.services.items[slug].title, `/services/${slug}`, t.service.items[slug].lead),
    ),
    "",
    "## How we work",
    ...t.home.process.steps.map((s, i) => `${i + 1}. ${s.title}: ${s.text}`),
    link("Our process in detail", "/process"),
    "",
    "## Pages",
    link("Home", "/"),
    link("All services", "/services"),
    link("Process and about the studio", "/process"),
    link("Start a project", startHref),
    link("Privacy policy", "/privacy"),
    `- Arabic version: ${absoluteUrl("/")} · French version: ${absoluteUrl(localizedPath("/", "fr"))}`,
    "",
    "## Follow",
    ...site.socials.map((s) => `- [${s.name}](${s.href})`),
    "",
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
