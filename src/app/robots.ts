import type { MetadataRoute } from "next";
import { isProductionSite, siteUrl } from "@/lib/seo";

/**
 * /robots.txt — the live site is open to every crawler and points to the sitemap. The thanks page is not
 * blocked here on purpose: it carries noindex, which crawlers can only read if they may fetch the page.
 * Preview deployments (VERCEL_ENV=preview) and local builds tell crawlers to stay out.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isProductionSite) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
