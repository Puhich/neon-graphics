"use client";

import { useContentStore } from "@/components/admin/ContentProvider";
import ListEditor from "@/components/admin/ListEditor";
import { Card, Field, Page, Row } from "@/components/admin/ui";

export default function StagesPage() {
  const { content, update } = useContentStore();
  const stages = content.stages;

  return (
    <Page title="Этапы работы" description="Как проходит заказ — от обращения до монтажа.">
      <Card title="Заголовок секции">
        <Field
          label="Заголовок"
          onChange={(value) => update((draft) => void (draft.stages.title = value))}
          path="stages.title"
          value={stages.title}
        />
        <Field
          label="Описание"
          onChange={(value) => update((draft) => void (draft.stages.subtitle = value))}
          path="stages.subtitle"
          rows={2}
          value={stages.subtitle}
        />
      </Card>

      <Card title="Шаги" description="Номера не подставляются автоматически — их можно писать как угодно.">
        <ListEditor
          addLabel="Добавить шаг"
          createItem={() => ({ number: String(stages.steps.length + 1), title: "Новый шаг", description: "" })}
          itemTitle={(item) => `${item.number}. ${item.title}`}
          items={stages.steps}
          onChange={(items) => update((draft) => void (draft.stages.steps = items))}
          renderItem={(item, index) => (
            <>
              <Row>
                <Field
                  label="Номер"
                  onChange={(value) => update((draft) => void (draft.stages.steps[index].number = value))}
                  path={`stages.steps.${index}.number`}
                  value={item.number}
                />
                <Field
                  label="Название"
                  onChange={(value) => update((draft) => void (draft.stages.steps[index].title = value))}
                  path={`stages.steps.${index}.title`}
                  value={item.title}
                />
              </Row>
              <Field
                label="Описание"
                onChange={(value) => update((draft) => void (draft.stages.steps[index].description = value))}
                path={`stages.steps.${index}.description`}
                rows={3}
                value={item.description}
              />
            </>
          )}
        />
      </Card>
    </Page>
  );
}
