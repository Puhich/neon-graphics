import type { CompanyContent, SiteContent } from "@/lib/content-schema";

// Телефон хранится один раз в человекочитаемом виде, ссылка tel: собирается
// из него автоматически: убираем всё кроме цифр, 8 в начале приводим к +7.
export function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("8") ? `7${digits.slice(1)}` : digits;

  return `tel:+${normalized}`;
}

export function mailtoHref(email: string): string {
  return `mailto:${email}`;
}

// Строки топбара и мобильного меню: телефон, короткий адрес, режим работы.
export function topBarItems(company: CompanyContent): string[] {
  return [company.phone, company.addressShort, company.scheduleShort];
}

// Копирайт собирается из реквизитов, год всегда текущий.
export function copyrightLine(company: CompanyContent): string {
  const parts = [`© ${new Date().getFullYear()} ${company.legalName}.`];

  if (company.inn && company.ogrn) {
    parts.push(`ИНН ${company.inn} / ОГРН ${company.ogrn}.`);
  } else if (company.inn) {
    parts.push(`ИНН ${company.inn}.`);
  }

  if (company.legalAddress) {
    parts.push(company.legalAddress);
  }

  return parts.join(" ");
}

// Колонка «Контакты» в футере — те же реквизиты, что и везде.
export function footerContactLinks(company: CompanyContent): { label: string; href?: string }[] {
  return [
    { label: company.phone, href: telHref(company.phone) },
    { label: company.email, href: mailtoHref(company.email) },
    { label: company.addressShort, href: "#contacts" },
    { label: company.schedule }
  ];
}

// Пустой siteUrl = домен ещё не привязан: тогда canonical и sitemap не строим.
export function siteUrl(content: SiteContent): string | null {
  const raw = content.meta.siteUrl.trim();

  if (!raw) {
    return null;
  }

  const withProtocol = /^https?:\/\//.test(raw) ? raw : `https://${raw}`;

  return withProtocol.replace(/\/+$/, "");
}

export function absoluteUrl(content: SiteContent, path: string): string | undefined {
  const base = siteUrl(content);

  return base ? `${base}${path.startsWith("/") ? path : `/${path}`}` : undefined;
}
