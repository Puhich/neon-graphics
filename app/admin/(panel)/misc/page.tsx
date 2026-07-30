"use client";

import { useContentStore } from "@/components/admin/ContentProvider";
import { Card, Field, Note, Page, Row, Toggle } from "@/components/admin/ui";

export default function MiscPage() {
  const { content, update } = useContentStore();
  const banner = content.cookieBanner;
  const notFound = content.notFound;

  return (
    <Page title="Cookie и страница 404" description="Плашка о файлах cookie и страница «не найдено».">
      <Card title="Cookie-баннер">
        <Toggle
          checked={banner.enabled}
          hint="Плашка появляется один раз: после выбора она больше не показывается."
          label="Показывать плашку"
          onChange={(value) => update((draft) => void (draft.cookieBanner.enabled = value))}
        />
        <Field
          label="Текст"
          onChange={(value) => update((draft) => void (draft.cookieBanner.text = value))}
          path="cookieBanner.text"
          rows={3}
          value={banner.text}
        />
        <Field
          label="Текст ссылки на политику"
          onChange={(value) => update((draft) => void (draft.cookieBanner.linkText = value))}
          path="cookieBanner.linkText"
          value={banner.linkText}
        />
        <Row>
          <Field
            label="Кнопка согласия"
            onChange={(value) => update((draft) => void (draft.cookieBanner.acceptLabel = value))}
            path="cookieBanner.acceptLabel"
            value={banner.acceptLabel}
          />
          <Field
            label="Кнопка отказа"
            onChange={(value) => update((draft) => void (draft.cookieBanner.declineLabel = value))}
            path="cookieBanner.declineLabel"
            value={banner.declineLabel}
          />
        </Row>
        <Note>
          При отказе сайт не подключает Яндекс.Метрику и не грузит карту Яндекса — вместо карты появляется кнопка
          «показать карту».
        </Note>
      </Card>

      <Card title="Страница 404" description="Что видит посетитель, если открыл несуществующий адрес.">
        <Field
          label="Заголовок"
          onChange={(value) => update((draft) => void (draft.notFound.title = value))}
          path="notFound.title"
          value={notFound.title}
        />
        <Field
          label="Описание"
          onChange={(value) => update((draft) => void (draft.notFound.subtitle = value))}
          path="notFound.subtitle"
          rows={3}
          value={notFound.subtitle}
        />
        <Row>
          <Field
            label="Кнопка на главную"
            onChange={(value) => update((draft) => void (draft.notFound.buttonLabel = value))}
            path="notFound.buttonLabel"
            value={notFound.buttonLabel}
          />
          <Field
            label="Вторая кнопка"
            onChange={(value) => update((draft) => void (draft.notFound.secondaryLabel = value))}
            path="notFound.secondaryLabel"
            value={notFound.secondaryLabel}
          />
        </Row>
      </Card>
    </Page>
  );
}
