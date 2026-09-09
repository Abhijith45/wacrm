import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://syncwa.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/features", "/pricing", "/contact", "/terms", "/privacy"],
        disallow: ["/api/", "/admin/", "/dashboard/", "/inbox/", "/contacts/", "/pipelines/", "/broadcasts/", "/automations/", "/flows/", "/settings/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
