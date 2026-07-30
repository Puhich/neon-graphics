"use client";

import { useContentStore } from "@/components/admin/ContentProvider";
import IconPicker from "@/components/admin/IconPicker";
import ImageField from "@/components/admin/ImageField";
import ListEditor from "@/components/admin/ListEditor";
import { Card, Field, Page, Row } from "@/components/admin/ui";

export default function ServicesPage() {
  const { content, update } = useContentStore();
  const services = content.services;

  return (
    <Page title="Услуги" description="Основные услуги с фотографиями и дополнительные услуги с иконками.">
      <Card title="Заголовок секции">
        <Field
          label="Заголовок"
          onChange={(value) => update((draft) => void (draft.services.title = value))}
          path="services.title"
          value={services.title}
        />
        <Field
          label="Описание"
          onChange={(value) => update((draft) => void (draft.services.subtitle = value))}
          path="services.subtitle"
          rows={3}
          value={services.subtitle}
        />
      </Card>

      <Card title="Основные услуги" description="Карточки с фотографией, описанием и ценой.">
        <ListEditor
          addLabel="Добавить услугу"
          createItem={() => ({
            icon: "sparkles",
            imageSrc: "",
            imageAlt: "",
            title: "Новая услуга",
            description: "",
            price: "от 0 ₽"
          })}
          itemTitle={(item) => item.title}
          items={services.main}
          onChange={(items) => update((draft) => void (draft.services.main = items))}
          renderItem={(item, index) => (
            <>
              <Field
                label="Название"
                onChange={(value) => update((draft) => void (draft.services.main[index].title = value))}
                path={`services.main.${index}.title`}
                value={item.title}
              />
              <Field
                label="Описание"
                onChange={(value) => update((draft) => void (draft.services.main[index].description = value))}
                path={`services.main.${index}.description`}
                rows={4}
                value={item.description}
              />
              <Row>
                <Field
                  hint="Например: от 15 000 ₽"
                  label="Цена"
                  onChange={(value) => update((draft) => void (draft.services.main[index].price = value))}
                  path={`services.main.${index}.price`}
                  value={item.price}
                />
                <IconPicker
                  hint="Пока не показывается на сайте, но пригодится для будущих блоков."
                  label="Иконка"
                  onChange={(value) => update((draft) => void (draft.services.main[index].icon = value))}
                  value={item.icon}
                />
              </Row>
              <ImageField
                label="Фотография"
                onChange={(src) => update((draft) => void (draft.services.main[index].imageSrc = src))}
                value={item.imageSrc}
              />
              <Field
                hint="Описание фото для поисковиков."
                label="Описание фото"
                onChange={(value) => update((draft) => void (draft.services.main[index].imageAlt = value))}
                path={`services.main.${index}.imageAlt`}
                value={item.imageAlt}
              />
            </>
          )}
        />
      </Card>

      <Card title="Дополнительные услуги" description="Небольшие карточки с иконкой.">
        <Field
          label="Заголовок блока"
          onChange={(value) => update((draft) => void (draft.services.additionalTitle = value))}
          path="services.additionalTitle"
          value={services.additionalTitle}
        />
        <ListEditor
          addLabel="Добавить услугу"
          createItem={() => ({ icon: "wrench", title: "Новая услуга", description: "", price: "от 0 ₽" })}
          itemTitle={(item) => item.title}
          items={services.additional}
          onChange={(items) => update((draft) => void (draft.services.additional = items))}
          renderItem={(item, index) => (
            <>
              <Row>
                <Field
                  label="Название"
                  onChange={(value) => update((draft) => void (draft.services.additional[index].title = value))}
                  path={`services.additional.${index}.title`}
                  value={item.title}
                />
                <Field
                  label="Цена"
                  onChange={(value) => update((draft) => void (draft.services.additional[index].price = value))}
                  path={`services.additional.${index}.price`}
                  value={item.price}
                />
              </Row>
              <Field
                label="Описание"
                onChange={(value) => update((draft) => void (draft.services.additional[index].description = value))}
                path={`services.additional.${index}.description`}
                rows={3}
                value={item.description}
              />
              <IconPicker
                hint="Иконка показывается слева от названия."
                label="Иконка"
                onChange={(value) => update((draft) => void (draft.services.additional[index].icon = value))}
                value={item.icon}
              />
            </>
          )}
        />
      </Card>
    </Page>
  );
}
