import type { MetadataRoute } from "next";
import { aiAgents, isProductionSite, siteUrl } from "@/lib/seo";

/**
 * /robots.txt — the live site is open to every crawler and points to the sitemap. AI assistants and AI search
 * crawlers are also named one by one (lib/seo.ts › aiAgents) so it is explicit that they may read the whole
 * site and recommend the studio. The thanks page is not blocked on purpose: it carries noindex, which
 * crawlers can only read if they may fetch it. Preview deployments and local builds tell crawlers to stay out.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isProductionSite) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: aiAgents, allow: "/" },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
