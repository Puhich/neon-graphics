import type { SiteContent } from "@/lib/content-schema";
import { siteUrl, telHref } from "@/lib/site";

// Карточка организации для поисковиков: адрес, телефон, часы работы.
// Собирается из реквизитов, отдельно ничего заполнять не нужно.
export function localBusinessJsonLd(content: SiteContent): string {
  const base = siteUrl(content);
  const company = content.company;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: company.legalName || company.name,
    alternateName: company.name,
    description: content.meta.description,
    telephone: telHref(company.phone).replace("tel:", ""),
    email: company.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: company.city,
      streetAddress: company.addressShort,
      addressCountry: "RU"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: content.contacts.mapCenter[0],
      longitude: content.contacts.mapCenter[1]
    },
    openingHours: "Mo-Fr 09:00-17:00",
    sameAs: content.nav.socials.map((social) => social.href)
  };

  if (company.foundedYear) {
    data.foundingDate = company.foundedYear;
  }

  if (base) {
    data.url = base;
    data.image = `${base}/icon.png`;
  }

  return JSON.stringify(data);
}
