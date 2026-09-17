import type { MetadataRoute } from "next";

import { getContent } from "@/lib/content";
import { siteUrl } from "@/lib/site";

// Пока домен не задан в админке, карту сайта не отдаём — иначе в ней будут
// неправильные адреса.
export default function sitemap(): MetadataRoute.Sitemap {
  const content = getContent();
  const base = siteUrl(content);

  if (!base) {
    return [];
  }

  const lastModified = new Date();

  return [
    { url: `${base}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${base}${content.footer.privacyHref}`, lastModified, changeFrequency: "yearly", priority: 0.3 }
  ];
}
