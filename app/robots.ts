import type { MetadataRoute } from "next";

import content from "@/lib/content";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl(content);

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"]
      }
    ],
    ...(base ? { sitemap: `${base}/sitemap.xml`, host: base } : {})
  };
}
