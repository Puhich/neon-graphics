"use client";

import { useContentStore } from "@/components/admin/ContentProvider";
import ImageField from "@/components/admin/ImageField";
import { Card, Field, Note, Page } from "@/components/admin/ui";

export default function SeoPage() {
  const { content, update } = useContentStore();
  const meta = content.meta;

  return (
    <Page
      title="SEO и счётчики"
      description="Как сайт выглядит в поиске и в мессенджерах, а также подключение аналитики."
    >
      <Card title="Адрес сайта">
        <Field
          hint="Например: neon-grafiks.ru. Нужен для карты сайта и правильных ссылок в превью. Пока поле пустое, эти функции выключены."
          label="Домен"
          onChange={(value) => update((draft) => void (draft.meta.siteUrl = value))}
          path="meta.siteUrl"
          value={meta.siteUrl}
        />
      </Card>

      <Card title="Поисковая выдача" description="Заголовок и описание, которые видно в Яндексе и Google.">
        <Field
          hint="До 60 символов — длиннее обрезается."
          label="Заголовок страницы"
          onChange={(value) => update((draft) => void (draft.meta.title = value))}
          path="meta.title"
          value={meta.title}
        />
        <Field
          hint="До 160 символов."
          label="Описание"
          onChange={(value) => update((draft) => void (draft.meta.description = value))}
          path="meta.description"
          rows={3}
          value={meta.description}
        />
      </Card>

      <Card
        title="Превью ссылки в мессенджерах"
        description="Что видно, когда ссылку на сайт отправляют в Telegram, WhatsApp или ВКонтакте."
      >
        <ImageField
          hint="Картинка 1200×630. Сервер сам обрежет и сожмёт."
          kind="og"
          label="Картинка"
          onChange={(src) => update((draft) => void (draft.meta.ogImage = src))}
          value={meta.ogImage}
        />
        <Field
          hint="Если пусто — берётся заголовок страницы."
          label="Заголовок превью"
          onChange={(value) => update((draft) => void (draft.meta.ogTitle = value))}
          path="meta.ogTitle"
          value={meta.ogTitle}
        />
        <Field
          hint="Если пусто — берётся описание страницы."
          label="Описание превью"
          onChange={(value) => update((draft) => void (draft.meta.ogDescription = value))}
          path="meta.ogDescription"
          rows={2}
          value={meta.ogDescription}
        />
      </Card>

      <Card title="Иконка сайта">
        <ImageField
          hint="Квадратная картинка от 512×512. Заменяет иконку во вкладке браузера и на экране телефона. Появится после публикации."
          kind="favicon"
          label="Иконка (favicon)"
          onChange={() => undefined}
          ratio="square"
          value="/icon.png"
        />
      </Card>

      <Card title="Аналитика и подтверждение прав">
        <Field
          hint="Только номер счётчика, например 12345678. Пусто — Метрика не подключается."
          label="Номер счётчика Яндекс.Метрики"
          onChange={(value) => update((draft) => void (draft.meta.yandexMetrikaId = value))}
          path="meta.yandexMetrikaId"
          value={meta.yandexMetrikaId}
        />
        <Field
          hint="Значение из мета-тега подтверждения в Яндекс.Вебмастере."
          label="Код Яндекс.Вебмастера"
          onChange={(value) => update((draft) => void (draft.meta.yandexVerification = value))}
          path="meta.yandexVerification"
          value={meta.yandexVerification}
        />
        <Field
          hint="Значение из мета-тега подтверждения в Google Search Console."
          label="Код Google Search Console"
          onChange={(value) => update((draft) => void (draft.meta.googleVerification = value))}
          path="meta.googleVerification"
          value={meta.googleVerification}
        />
        <Note>
          В Метрике стоит создать цель типа «JavaScript-событие» с идентификатором <b>lead_form_submit</b> — сайт
          отправляет это событие при успешной заявке.
        </Note>
      </Card>
    </Page>
  );
}
