"use client";

import { useContentStore } from "@/components/admin/ContentProvider";
import ListEditor from "@/components/admin/ListEditor";
import { Card, Field, Page, Row } from "@/components/admin/ui";

export default function CtaPage() {
  const { content, update } = useContentStore();
  const cta = content.cta;

  return (
    <Page title="Блок с призывом" description="Тёмная карточка между портфолио и этапами работы.">
      <Card title="Тексты">
        <Field
          hint="Перенос строки в заголовке сохраняется — можно разбить на две строки."
          label="Заголовок"
          onChange={(value) => update((draft) => void (draft.cta.title = value))}
          path="cta.title"
          rows={2}
          value={cta.title}
        />
        <Field
          label="Описание"
          onChange={(value) => update((draft) => void (draft.cta.subtitle = value))}
          path="cta.subtitle"
          rows={3}
          value={cta.subtitle}
        />
        <Row>
          <Field
            label="Текст кнопки"
            onChange={(value) => update((draft) => void (draft.cta.button.label = value))}
            path="cta.button.label"
            value={cta.button.label}
          />
          <Field
            label="Ссылка кнопки"
            onChange={(value) => update((draft) => void (draft.cta.button.href = value))}
            path="cta.button.href"
            value={cta.button.href}
          />
        </Row>
      </Card>

      <Card title="Галочки">
        <ListEditor
          addLabel="Добавить галочку"
          createItem={() => "Новый пункт"}
          itemTitle={(item) => item}
          items={cta.checks}
          onChange={(items) => update((draft) => void (draft.cta.checks = items))}
          renderItem={(item, index) => (
            <Field
              label="Текст"
              onChange={(value) => update((draft) => void (draft.cta.checks[index] = value))}
              path={`cta.checks.${index}`}
              value={item}
            />
          )}
        />
      </Card>
    </Page>
  );
}
