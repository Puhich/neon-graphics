"use client";

import { useContentStore } from "@/components/admin/ContentProvider";
import ListEditor from "@/components/admin/ListEditor";
import { Card, Field, Page } from "@/components/admin/ui";

export default function FaqPage() {
  const { content, update } = useContentStore();
  const faq = content.faq;

  return (
    <Page title="Вопросы и ответы" description="Раскрывающийся список частых вопросов.">
      <Card title="Заголовок секции">
        <Field
          label="Заголовок"
          onChange={(value) => update((draft) => void (draft.faq.title = value))}
          path="faq.title"
          value={faq.title}
        />
        <Field
          label="Описание"
          onChange={(value) => update((draft) => void (draft.faq.subtitle = value))}
          path="faq.subtitle"
          rows={2}
          value={faq.subtitle}
        />
      </Card>

      <Card title="Вопросы">
        <ListEditor
          addLabel="Добавить вопрос"
          createItem={() => ({ question: "Новый вопрос", answer: "" })}
          itemTitle={(item) => item.question}
          items={faq.items}
          onChange={(items) => update((draft) => void (draft.faq.items = items))}
          renderItem={(item, index) => (
            <>
              <Field
                label="Вопрос"
                onChange={(value) => update((draft) => void (draft.faq.items[index].question = value))}
                path={`faq.items.${index}.question`}
                value={item.question}
              />
              <Field
                label="Ответ"
                onChange={(value) => update((draft) => void (draft.faq.items[index].answer = value))}
                path={`faq.items.${index}.answer`}
                rows={4}
                value={item.answer}
              />
            </>
          )}
        />
      </Card>
    </Page>
  );
}
