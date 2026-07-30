"use client";

import { useContentStore } from "@/components/admin/ContentProvider";
import IconPicker from "@/components/admin/IconPicker";
import ImageField from "@/components/admin/ImageField";
import ListEditor from "@/components/admin/ListEditor";
import { Card, Field, Page, Row, Toggle } from "@/components/admin/ui";

export default function WhyUsPage() {
  const { content, update } = useContentStore();
  const whyUs = content.whyUs;

  return (
    <Page title="Почему выбирают нас" description="Крупные блоки с фотографиями и четыре преимущества под ними.">
      <Card title="Заголовок секции">
        <Field
          hint="Маленькая надпись над заголовком."
          label="Надзаголовок"
          onChange={(value) => update((draft) => void (draft.whyUs.eyebrow = value))}
          path="whyUs.eyebrow"
          value={whyUs.eyebrow}
        />
        <Field
          label="Заголовок"
          onChange={(value) => update((draft) => void (draft.whyUs.title = value))}
          path="whyUs.title"
          value={whyUs.title}
        />
        <Field
          label="Описание"
          onChange={(value) => update((draft) => void (draft.whyUs.subtitle = value))}
          path="whyUs.subtitle"
          rows={2}
          value={whyUs.subtitle}
        />
      </Card>

      <Card title="Блоки с фотографиями">
        <ListEditor
          addLabel="Добавить блок"
          createItem={() => ({
            card: { eyebrow: "", title: "Новый блок", description: "", metrics: [] },
            image: { src: "", alt: "" },
            imageFirst: false
          })}
          itemTitle={(item) => item.card.title}
          items={whyUs.rows}
          onChange={(items) => update((draft) => void (draft.whyUs.rows = items))}
          renderItem={(item, index) => (
            <>
              <Field
                label="Надзаголовок"
                onChange={(value) => update((draft) => void (draft.whyUs.rows[index].card.eyebrow = value))}
                path={`whyUs.rows.${index}.card.eyebrow`}
                value={item.card.eyebrow}
              />
              <Field
                label="Заголовок"
                onChange={(value) => update((draft) => void (draft.whyUs.rows[index].card.title = value))}
                path={`whyUs.rows.${index}.card.title`}
                value={item.card.title}
              />
              <Field
                label="Описание"
                onChange={(value) => update((draft) => void (draft.whyUs.rows[index].card.description = value))}
                path={`whyUs.rows.${index}.card.description`}
                rows={4}
                value={item.card.description}
              />

              <div className="rounded-xl border border-[var(--adm-border)] p-4">
                <p className="mb-3 text-[13px] font-semibold text-[var(--adm-text-2)]">Цифры в блоке</p>
                <ListEditor
                  addLabel="Добавить цифру"
                  createItem={() => ({ value: "100%", label: "подпись" })}
                  itemTitle={(metric) => `${metric.value} — ${metric.label}`}
                  items={item.card.metrics}
                  onChange={(metrics) => update((draft) => void (draft.whyUs.rows[index].card.metrics = metrics))}
                  renderItem={(metric, metricIndex) => (
                    <Row>
                      <Field
                        label="Значение"
                        onChange={(value) =>
                          update((draft) => void (draft.whyUs.rows[index].card.metrics[metricIndex].value = value))
                        }
                        path={`whyUs.rows.${index}.card.metrics.${metricIndex}.value`}
                        value={metric.value}
                      />
                      <Field
                        label="Подпись"
                        onChange={(value) =>
                          update((draft) => void (draft.whyUs.rows[index].card.metrics[metricIndex].label = value))
                        }
                        path={`whyUs.rows.${index}.card.metrics.${metricIndex}.label`}
                        value={metric.label}
                      />
                    </Row>
                  )}
                />
              </div>

              <ImageField
                label="Фотография"
                onChange={(src) => update((draft) => void (draft.whyUs.rows[index].image.src = src))}
                value={item.image.src}
              />
              <Field
                label="Описание фото"
                onChange={(value) => update((draft) => void (draft.whyUs.rows[index].image.alt = value))}
                path={`whyUs.rows.${index}.image.alt`}
                value={item.image.alt}
              />
              <Toggle
                checked={item.imageFirst}
                hint="На компьютере блоки чередуются: так фото будет слева, а текст справа."
                label="Фото слева"
                onChange={(value) => update((draft) => void (draft.whyUs.rows[index].imageFirst = value))}
              />
            </>
          )}
        />
      </Card>

      <Card title="Преимущества" description="Четыре карточки с иконками внизу секции.">
        <ListEditor
          addLabel="Добавить преимущество"
          createItem={() => ({ icon: "shield-check", title: "Новое преимущество", description: "" })}
          itemTitle={(item) => item.title}
          items={whyUs.advantages}
          onChange={(items) => update((draft) => void (draft.whyUs.advantages = items))}
          renderItem={(item, index) => (
            <>
              <Field
                label="Название"
                onChange={(value) => update((draft) => void (draft.whyUs.advantages[index].title = value))}
                path={`whyUs.advantages.${index}.title`}
                value={item.title}
              />
              <Field
                label="Описание"
                onChange={(value) => update((draft) => void (draft.whyUs.advantages[index].description = value))}
                path={`whyUs.advantages.${index}.description`}
                rows={2}
                value={item.description}
              />
              <IconPicker
                label="Иконка"
                onChange={(value) => update((draft) => void (draft.whyUs.advantages[index].icon = value))}
                value={item.icon}
              />
            </>
          )}
        />
      </Card>
    </Page>
  );
}
