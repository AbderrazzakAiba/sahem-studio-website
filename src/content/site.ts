/**
 * Studio facts shared by every page (contact details from the brief). Not translated.
 * phones: the studio's WhatsApp numbers (the footer links each one to its WhatsApp chat).
 * whatsapp: the main number for the WhatsApp buttons — international, without "+" or spaces. Set to null
 * to hide those buttons.
 */
export const site = {
  /** Public address (Cloudflare Email Routing forwards it to the team mailbox). */
  email: "contact@sahemstudio.com",
  phones: [
    { display: "0669 91 37 38", tel: "+213669913738" },
    { display: "0659 60 80 46", tel: "+213659608046" },
  ],
  whatsapp: "213669913738" as string | null,
  /** Static on purpose: pages are prerendered (Cache Components), so the year can't be read at request time. */
  copyrightYear: 2026,
  socials: [
    { name: "Instagram", icon: "instagram", handle: "@sahem.studio", href: "https://www.instagram.com/sahem.studio/" },
    { name: "TikTok", icon: "tiktok", handle: "@sahem.studio", href: "https://www.tiktok.com/@sahem.studio" },
    {
      name: "Facebook",
      icon: "facebook",
      handle: null,
      href: "https://www.facebook.com/profile.php?id=61596534650440",
    },
  ],
} as const;

export const whatsappHref = (number: string | null) => (number ? `https://wa.me/${number}` : null);

/** Site sections in navigation order (paths without locale prefix). */
export const navItems = [
  { key: "services", href: "/services" },
  { key: "work", href: "/work" },
  { key: "process", href: "/process" },
] as const;

export const startHref = "/start";
export const privacyHref = "/privacy";
