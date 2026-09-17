import type { MetadataRoute } from "next";

import { getContent } from "@/lib/content";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const content = getContent();
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
