"use client";

import { useContentStore } from "@/components/admin/ContentProvider";
import ImageField from "@/components/admin/ImageField";
import ListEditor from "@/components/admin/ListEditor";
import { Card, Field, Page, Row } from "@/components/admin/ui";

export default function ReviewsPage() {
  const { content, update } = useContentStore();
  const reviews = content.reviews;

  return (
    <Page title="Отзывы" description="Слайдер с отзывами клиентов.">
      <Card title="Заголовок секции">
        <Field
          label="Заголовок"
          onChange={(value) => update((draft) => void (draft.reviews.title = value))}
          path="reviews.title"
          value={reviews.title}
        />
        <Field
          label="Описание"
          onChange={(value) => update((draft) => void (draft.reviews.subtitle = value))}
          path="reviews.subtitle"
          rows={2}
          value={reviews.subtitle}
        />
        <Row>
          <Field
            label="Подпись «предыдущий»"
            onChange={(value) => update((draft) => void (draft.reviews.previousLabel = value))}
            path="reviews.previousLabel"
            value={reviews.previousLabel}
          />
          <Field
            label="Подпись «следующий»"
            onChange={(value) => update((draft) => void (draft.reviews.nextLabel = value))}
            path="reviews.nextLabel"
            value={reviews.nextLabel}
          />
        </Row>
      </Card>

      <Card title="Отзывы">
        <ListEditor
          addLabel="Добавить отзыв"
          createItem={() => ({ imageSrc: "", imageAlt: "", text: "«»", author: "Имя", company: "" })}
          itemTitle={(item) => `${item.author}${item.company ? ` — ${item.company}` : ""}`}
          items={reviews.items}
          onChange={(items) => update((draft) => void (draft.reviews.items = items))}
          renderItem={(item, index) => (
            <>
              <Field
                label="Текст отзыва"
                onChange={(value) => update((draft) => void (draft.reviews.items[index].text = value))}
                path={`reviews.items.${index}.text`}
                rows={5}
                value={item.text}
              />
              <Row>
                <Field
                  label="Автор"
                  onChange={(value) => update((draft) => void (draft.reviews.items[index].author = value))}
                  path={`reviews.items.${index}.author`}
                  value={item.author}
                />
                <Field
                  label="Компания"
                  onChange={(value) => update((draft) => void (draft.reviews.items[index].company = value))}
                  path={`reviews.items.${index}.company`}
                  value={item.company}
                />
              </Row>
              <ImageField
                hint="Фотография работы, о которой отзыв."
                label="Фотография"
                onChange={(src) => update((draft) => void (draft.reviews.items[index].imageSrc = src))}
                value={item.imageSrc}
              />
              <Field
                label="Описание фото"
                onChange={(value) => update((draft) => void (draft.reviews.items[index].imageAlt = value))}
                path={`reviews.items.${index}.imageAlt`}
                value={item.imageAlt}
              />
            </>
          )}
        />
      </Card>
    </Page>
  );
}
