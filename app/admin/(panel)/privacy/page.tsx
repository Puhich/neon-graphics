"use client";

import { useContentStore } from "@/components/admin/ContentProvider";
import ListEditor from "@/components/admin/ListEditor";
import { Card, Field, Note, Page, Row } from "@/components/admin/ui";

export default function PrivacyPage() {
  const { content, update } = useContentStore();
  const privacy = content.privacy;

  return (
    <Page
      title="Политика конфиденциальности"
      description="Отдельная страница сайта. На неё ведут ссылка в футере, ссылка под формой и плашка о cookie."
    >
      <Card title="Шапка страницы">
        <Field
          label="Заголовок"
          onChange={(value) => update((draft) => void (draft.privacy.title = value))}
          path="privacy.title"
          value={privacy.title}
        />
        <Row>
          <Field
            hint="Например: 30 июля 2026 года"
            label="Дата последнего изменения"
            onChange={(value) => update((draft) => void (draft.privacy.updatedAt = value))}
            path="privacy.updatedAt"
            value={privacy.updatedAt}
          />
          <Field
            label="Кнопка возврата"
            onChange={(value) => update((draft) => void (draft.privacy.backLabel = value))}
            path="privacy.backLabel"
            value={privacy.backLabel}
          />
        </Row>
        <Field
          label="Вступление"
          onChange={(value) => update((draft) => void (draft.privacy.intro = value))}
          path="privacy.intro"
          rows={3}
          value={privacy.intro}
        />
      </Card>

      <Card title="Разделы документа">
        <Note tone="warn">
          Текст подготовлен по образцу и требует проверки юристом клиента: реквизиты, цели обработки и сроки хранения
          должны совпадать с реальными.
        </Note>
        <ListEditor
          addLabel="Добавить раздел"
          createItem={() => ({ title: "Новый раздел", text: "" })}
          itemTitle={(item) => item.title}
          items={privacy.sections}
          onChange={(items) => update((draft) => void (draft.privacy.sections = items))}
          renderItem={(item, index) => (
            <>
              <Field
                label="Заголовок раздела"
                onChange={(value) => update((draft) => void (draft.privacy.sections[index].title = value))}
                path={`privacy.sections.${index}.title`}
                value={item.title}
              />
              <Field
                hint="Абзацы разделяются пустой строкой."
                label="Текст"
                onChange={(value) => update((draft) => void (draft.privacy.sections[index].text = value))}
                path={`privacy.sections.${index}.text`}
                rows={8}
                value={item.text}
              />
            </>
          )}
        />
      </Card>
    </Page>
  );
}
