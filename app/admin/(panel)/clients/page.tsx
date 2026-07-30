"use client";

import { useContentStore } from "@/components/admin/ContentProvider";
import ImageField from "@/components/admin/ImageField";
import ListEditor from "@/components/admin/ListEditor";
import { Card, Field, Page } from "@/components/admin/ui";

export default function ClientsPage() {
  const { content, update } = useContentStore();
  const clients = content.clientsLogos;

  return (
    <Page title="Логотипы клиентов" description="Лента логотипов сразу под первым экраном.">
      <Card title="Заголовок">
        <Field
          label="Заголовок"
          onChange={(value) => update((draft) => void (draft.clientsLogos.title = value))}
          path="clientsLogos.title"
          value={clients.title}
        />
        <Field
          label="Подпись под лентой"
          onChange={(value) => update((draft) => void (draft.clientsLogos.note = value))}
          path="clientsLogos.note"
          rows={2}
          value={clients.note}
        />
      </Card>

      <Card title="Логотипы" description="Лучше загружать PNG с прозрачным фоном — сервер сам сожмёт.">
        <ListEditor
          addLabel="Добавить логотип"
          createItem={() => ({ src: "", alt: "" })}
          itemTitle={(item, index) => item.alt || `Логотип ${index + 1}`}
          items={clients.items}
          onChange={(items) => update((draft) => void (draft.clientsLogos.items = items))}
          renderItem={(item, index) => (
            <>
              <ImageField
                kind="logo"
                label="Логотип"
                onChange={(src) => update((draft) => void (draft.clientsLogos.items[index].src = src))}
                ratio="logo"
                value={item.src}
              />
              <Field
                hint="Название компании."
                label="Название"
                onChange={(value) => update((draft) => void (draft.clientsLogos.items[index].alt = value))}
                path={`clientsLogos.items.${index}.alt`}
                value={item.alt}
              />
            </>
          )}
        />
      </Card>
    </Page>
  );
}
