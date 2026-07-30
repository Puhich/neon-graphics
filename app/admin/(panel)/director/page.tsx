"use client";

import { useContentStore } from "@/components/admin/ContentProvider";
import ImageField from "@/components/admin/ImageField";
import { Card, Field, Page, Row } from "@/components/admin/ui";

export default function DirectorPage() {
  const { content, update } = useContentStore();
  const quote = content.directorQuote;

  return (
    <Page title="Цитата директора" description="Блок с фотографией, цитатой и подписью.">
      <Card title="Цитата">
        <Field
          label="Текст"
          onChange={(value) => update((draft) => void (draft.directorQuote.text = value))}
          path="directorQuote.text"
          rows={5}
          value={quote.text}
        />
        <Row>
          <Field
            label="Имя"
            onChange={(value) => update((draft) => void (draft.directorQuote.author = value))}
            path="directorQuote.author"
            value={quote.author}
          />
          <Field
            label="Должность"
            onChange={(value) => update((draft) => void (draft.directorQuote.role = value))}
            path="directorQuote.role"
            value={quote.role}
          />
        </Row>
        <Field
          hint="Крупный знак кавычки перед цитатой."
          label="Знак кавычки"
          onChange={(value) => update((draft) => void (draft.directorQuote.quoteMark = value))}
          path="directorQuote.quoteMark"
          value={quote.quoteMark}
        />
      </Card>

      <Card title="Фотография">
        <ImageField
          label="Фото"
          onChange={(src) => update((draft) => void (draft.directorQuote.imageSrc = src))}
          ratio="square"
          value={quote.imageSrc}
        />
        <Field
          label="Описание фото"
          onChange={(value) => update((draft) => void (draft.directorQuote.imageAlt = value))}
          path="directorQuote.imageAlt"
          value={quote.imageAlt}
        />
      </Card>

      <Card title="Подпись от руки">
        <ImageField
          hint="Картинка с подписью. Лучше PNG с прозрачным фоном."
          kind="brand"
          label="Подпись"
          onChange={(src) => update((draft) => void (draft.directorQuote.signatureSrc = src))}
          ratio="logo"
          value={quote.signatureSrc}
        />
        <Field
          label="Описание подписи"
          onChange={(value) => update((draft) => void (draft.directorQuote.signatureAlt = value))}
          path="directorQuote.signatureAlt"
          value={quote.signatureAlt}
        />
      </Card>
    </Page>
  );
}
