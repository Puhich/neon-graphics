"use client";

import { useContentStore } from "@/components/admin/ContentProvider";
import ImageField from "@/components/admin/ImageField";
import ListEditor from "@/components/admin/ListEditor";
import { Card, Field, Page, Row } from "@/components/admin/ui";

export default function PortfolioPage() {
  const { content, update } = useContentStore();
  const portfolio = content.portfolio;

  return (
    <Page title="Портфолио" description="Крупное фото проекта и лента миниатюр под ним.">
      <Card title="Заголовок секции">
        <Field
          label="Заголовок"
          onChange={(value) => update((draft) => void (draft.portfolio.title = value))}
          path="portfolio.title"
          value={portfolio.title}
        />
        <Field
          label="Описание"
          onChange={(value) => update((draft) => void (draft.portfolio.subtitle = value))}
          path="portfolio.subtitle"
          rows={2}
          value={portfolio.subtitle}
        />
        <Row>
          <Field
            hint="Подпись стрелки «назад» для читалок."
            label="Подпись «предыдущий»"
            onChange={(value) => update((draft) => void (draft.portfolio.previousLabel = value))}
            path="portfolio.previousLabel"
            value={portfolio.previousLabel}
          />
          <Field
            label="Подпись «следующий»"
            onChange={(value) => update((draft) => void (draft.portfolio.nextLabel = value))}
            path="portfolio.nextLabel"
            value={portfolio.nextLabel}
          />
        </Row>
      </Card>

      <Card title="Главное фото">
        <ImageField
          label="Крупное фото проекта"
          onChange={(src) => update((draft) => void (draft.portfolio.featured.src = src))}
          value={portfolio.featured.src}
        />
        <Field
          label="Описание фото"
          onChange={(value) => update((draft) => void (draft.portfolio.featured.alt = value))}
          path="portfolio.featured.alt"
          value={portfolio.featured.alt}
        />
      </Card>

      <Card title="Миниатюры" description="Нажатие на миниатюру показывает её крупно.">
        <ListEditor
          addLabel="Добавить проект"
          createItem={() => ({ src: "", alt: "" })}
          itemTitle={(item, index) => item.alt || `Проект ${index + 1}`}
          items={portfolio.thumbnails}
          onChange={(items) => update((draft) => void (draft.portfolio.thumbnails = items))}
          renderItem={(item, index) => (
            <>
              <ImageField
                label="Фотография"
                onChange={(src) => update((draft) => void (draft.portfolio.thumbnails[index].src = src))}
                value={item.src}
              />
              <Field
                label="Описание"
                onChange={(value) => update((draft) => void (draft.portfolio.thumbnails[index].alt = value))}
                path={`portfolio.thumbnails.${index}.alt`}
                value={item.alt}
              />
            </>
          )}
        />
      </Card>
    </Page>
  );
}
