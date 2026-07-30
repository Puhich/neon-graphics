// Разделы админки. Порядок совпадает с порядком секций на сайте, чтобы
// клиенту было привычно: сверху вниз, как на странице.

export type AdminNavItem = {
  href: string;
  label: string;
  hint?: string;
};

export type AdminNavGroup = {
  title: string;
  items: AdminNavItem[];
};

export const adminNav: AdminNavGroup[] = [
  {
    title: "Обзор",
    items: [{ href: "/admin", label: "Дашборд", hint: "Что изменено и публикация" }]
  },
  {
    title: "Секции сайта",
    items: [
      { href: "/admin/header", label: "Шапка и меню", hint: "Логотип, пункты меню, соцсети" },
      { href: "/admin/hero", label: "Первый экран", hint: "Заголовки, кнопки, фото, цифры" },
      { href: "/admin/clients", label: "Логотипы клиентов" },
      { href: "/admin/services", label: "Услуги", hint: "Основные и дополнительные" },
      { href: "/admin/portfolio", label: "Портфолио" },
      { href: "/admin/why-us", label: "Почему выбирают нас" },
      { href: "/admin/cta", label: "Блок с призывом" },
      { href: "/admin/stages", label: "Этапы работы" },
      { href: "/admin/reviews", label: "Отзывы" },
      { href: "/admin/director", label: "Цитата директора" },
      { href: "/admin/faq", label: "Вопросы и ответы" },
      { href: "/admin/form", label: "Форма заявки" },
      { href: "/admin/contacts", label: "Контакты и карта" },
      { href: "/admin/footer", label: "Футер" }
    ]
  },
  {
    title: "Настройки сайта",
    items: [
      { href: "/admin/company", label: "Реквизиты", hint: "Телефон, почта, адрес, режим" },
      { href: "/admin/seo", label: "SEO и счётчики" },
      { href: "/admin/privacy", label: "Политика конфиденциальности" },
      { href: "/admin/misc", label: "Cookie и страница 404" },
      { href: "/admin/settings", label: "Проверка интеграций" }
    ]
  }
];

// Какие разделы контента относятся к какому экрану админки — нужно, чтобы
// показывать «изменено» рядом с пунктом меню.
export const sectionsByRoute: Record<string, string[]> = {
  "/admin/header": ["nav"],
  "/admin/hero": ["hero"],
  "/admin/clients": ["clientsLogos"],
  "/admin/services": ["services"],
  "/admin/portfolio": ["portfolio"],
  "/admin/why-us": ["whyUs"],
  "/admin/cta": ["cta"],
  "/admin/stages": ["stages"],
  "/admin/reviews": ["reviews"],
  "/admin/director": ["directorQuote"],
  "/admin/faq": ["faq"],
  "/admin/form": ["finalForm"],
  "/admin/contacts": ["contacts"],
  "/admin/footer": ["footer"],
  "/admin/company": ["company"],
  "/admin/seo": ["meta"],
  "/admin/privacy": ["privacy"],
  "/admin/misc": ["cookieBanner", "notFound"]
};

export const sectionTitles: Record<string, string> = {
  meta: "SEO и счётчики",
  company: "Реквизиты",
  nav: "Шапка и меню",
  hero: "Первый экран",
  clientsLogos: "Логотипы клиентов",
  services: "Услуги",
  whyUs: "Почему выбирают нас",
  cta: "Блок с призывом",
  stages: "Этапы работы",
  reviews: "Отзывы",
  directorQuote: "Цитата директора",
  faq: "Вопросы и ответы",
  finalForm: "Форма заявки",
  contacts: "Контакты и карта",
  footer: "Футер",
  portfolio: "Портфолио",
  cookieBanner: "Cookie-баннер",
  notFound: "Страница 404",
  privacy: "Политика конфиденциальности"
};
