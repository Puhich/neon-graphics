"use client";

import { useContentStore } from "@/components/admin/ContentProvider";
import ListEditor from "@/components/admin/ListEditor";
import { Card, Field, Note, Page, Row } from "@/components/admin/ui";

export default function FormPage() {
  const { content, update } = useContentStore();
  const form = content.finalForm;

  return (
    <Page title="Форма заявки" description="Блок «Начните прямо сейчас» с формой в нижней части сайта.">
      <Card title="Тексты слева">
        <Field
          label="Надзаголовок"
          onChange={(value) => update((draft) => void (draft.finalForm.eyebrow = value))}
          path="finalForm.eyebrow"
          value={form.eyebrow}
        />
        <Field
          hint="Перенос строки сохраняется."
          label="Заголовок"
          onChange={(value) => update((draft) => void (draft.finalForm.title = value))}
          path="finalForm.title"
          rows={2}
          value={form.title}
        />
        <Field
          label="Описание"
          onChange={(value) => update((draft) => void (draft.finalForm.description = value))}
          path="finalForm.description"
          rows={4}
          value={form.description}
        />
      </Card>

      <Card title="Список с галочками">
        <ListEditor
          addLabel="Добавить пункт"
          createItem={() => "Новый пункт"}
          itemTitle={(item) => item}
          items={form.bullets}
          onChange={(items) => update((draft) => void (draft.finalForm.bullets = items))}
          renderItem={(item, index) => (
            <Field
              label="Текст"
              onChange={(value) => update((draft) => void (draft.finalForm.bullets[index] = value))}
              path={`finalForm.bullets.${index}`}
              value={item}
            />
          )}
        />
      </Card>

      <Card title="Поля формы" description="Названия полей и подсказки внутри них.">
        <Row>
          <Field
            label="Название поля «Имя»"
            onChange={(value) => update((draft) => void (draft.finalForm.nameLabel = value))}
            path="finalForm.nameLabel"
            value={form.nameLabel}
          />
          <Field
            label="Подсказка в поле «Имя»"
            onChange={(value) => update((draft) => void (draft.finalForm.namePlaceholder = value))}
            path="finalForm.namePlaceholder"
            value={form.namePlaceholder}
          />
        </Row>
        <Row>
          <Field
            label="Название поля «Телефон»"
            onChange={(value) => update((draft) => void (draft.finalForm.phoneLabel = value))}
            path="finalForm.phoneLabel"
            value={form.phoneLabel}
          />
          <Field
            label="Подсказка в поле «Телефон»"
            onChange={(value) => update((draft) => void (draft.finalForm.phonePlaceholder = value))}
            path="finalForm.phonePlaceholder"
            value={form.phonePlaceholder}
          />
        </Row>
        <Row>
          <Field
            label="Название поля «Email»"
            onChange={(value) => update((draft) => void (draft.finalForm.emailLabel = value))}
            path="finalForm.emailLabel"
            value={form.emailLabel}
          />
          <Field
            label="Подсказка в поле «Email»"
            onChange={(value) => update((draft) => void (draft.finalForm.emailPlaceholder = value))}
            path="finalForm.emailPlaceholder"
            value={form.emailPlaceholder}
          />
        </Row>
        <Row>
          <Field
            label="Название поля «Сообщение»"
            onChange={(value) => update((draft) => void (draft.finalForm.messageLabel = value))}
            path="finalForm.messageLabel"
            value={form.messageLabel}
          />
          <Field
            label="Подсказка в поле «Сообщение»"
            onChange={(value) => update((draft) => void (draft.finalForm.messagePlaceholder = value))}
            path="finalForm.messagePlaceholder"
            value={form.messagePlaceholder}
          />
        </Row>
      </Card>

      <Card title="Кнопка и согласие">
        <Row>
          <Field
            label="Текст кнопки"
            onChange={(value) => update((draft) => void (draft.finalForm.submitText = value))}
            path="finalForm.submitText"
            value={form.submitText}
          />
          <Field
            label="Текст во время отправки"
            onChange={(value) => update((draft) => void (draft.finalForm.sendingText = value))}
            path="finalForm.sendingText"
            value={form.sendingText}
          />
        </Row>
        <Field
          hint="Текст рядом с галочкой согласия — заканчивается ссылкой на политику."
          label="Текст согласия"
          onChange={(value) => update((draft) => void (draft.finalForm.consentPrefix = value))}
          path="finalForm.consentPrefix"
          rows={2}
          value={form.consentPrefix}
        />
        <Field
          label="Текст ссылки на политику"
          onChange={(value) => update((draft) => void (draft.finalForm.consentLinkText = value))}
          path="finalForm.consentLinkText"
          value={form.consentLinkText}
        />
        <Note>
          Галочка согласия обязательна: без неё кнопка отправки не активна. Так требует закон о персональных данных.
        </Note>
      </Card>

      <Card title="Сообщения после отправки">
        <Row>
          <Field
            label="Заголовок успеха"
            onChange={(value) => update((draft) => void (draft.finalForm.successTitle = value))}
            path="finalForm.successTitle"
            value={form.successTitle}
          />
          <Field
            label="Текст ошибки"
            onChange={(value) => update((draft) => void (draft.finalForm.errorText = value))}
            path="finalForm.errorText"
            value={form.errorText}
          />
        </Row>
        <Field
          label="Текст успеха"
          onChange={(value) => update((draft) => void (draft.finalForm.successText = value))}
          path="finalForm.successText"
          rows={2}
          value={form.successText}
        />
      </Card>
    </Page>
  );
}
