# Neon Graphics Project Status

Last updated: 2026-07-30

## Current Goal

Лендинг готов и одобрен клиентом. Админка на `/admin` собрана: клиент правит
весь контент сам и публикует изменения в один клик. Осталось привязать домен,
подключить аналитику и заполнить переменные окружения на Vercel —
подробности в `LAUNCH-CHECKLIST.md`.

## Repository

- GitHub: `https://github.com/Puhich/neon-graphics`
- Branch: `main` (Vercel деплоит отсюда)
- Stack: Next.js 14 App Router, TypeScript, Tailwind CSS
- Контент сайта: `data/content.json`, схема — `lib/content-schema.ts`

## Important Files

Сайт:

- `app/page.tsx` — состав и порядок секций
- `app/privacy/page.tsx` — политика конфиденциальности
- `app/not-found.tsx` — 404
- `app/robots.ts`, `app/sitemap.ts` — генерируются из домена в админке
- `components/Hero.tsx`, `Services.tsx`, `WhyUs.tsx`, `Portfolio.tsx`,
  `Reviews.tsx`, `DirectorQuote.tsx`, `FAQ.tsx`, `FinalForm.tsx`,
  `Contacts.tsx`, `Footer.tsx` — секции
- `components/SectionWatermark.tsx` — рыбка-водяной знак (хрупкая логика,
  вместе с блоками `@media (hover: none)` в `app/globals.css`)
- `components/CookieBanner.tsx`, `Metrika.tsx`, `SiteChrome.tsx`

Админка:

- `app/admin/(panel)/…` — 19 разделов
- `components/admin/…` — оболочка, черновик, поля, списки, пикер иконок
- `app/api/admin/…` — вход, публикация, загрузка картинок, иконки, статус
- `app/api/lead` — заявки в Telegram и на почту
- `lib/publisher.ts` — коммит в GitHub (или запись на диск локально)

## Current State

- Реквизиты (телефон, почта, адрес, режим работы) вводятся один раз в разделе
  «Реквизиты» и подставляются в топбар, контакты, футер, копирайт, кнопку звонка.
- Иконки услуг и преимуществ — lucide по имени, в админке пикер с поиском.
- Загрузка фото сама делает webp + варианты 640/1280 для кастомного лоадера.
- Публикация — атомарный коммит `data/content.json`; ассеты коммитятся сразу
  с `[skip ci]`.
- Форма заявки рабочая: валидация, honeypot, ограничение частоты, цель Метрики
  `lead_form_submit`.
- Cookie-баннер: при отказе не грузятся Метрика и карта Яндекса.

## Next Steps

Всё в `LAUNCH-CHECKLIST.md`: переменные в Vercel, домен, SPF/DKIM/DMARC,
Метрика и Вебмастер, OG-картинка, реальные ссылки соцсетей, вычитка политики
юристом, финальная проверка и передача доступов клиенту.

## Commands

```bash
npm run dev
npm run build
npm run lint
```
