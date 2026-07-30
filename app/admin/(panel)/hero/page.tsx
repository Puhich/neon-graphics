"use client";

import { useContentStore } from "@/components/admin/ContentProvider";
import ImageField from "@/components/admin/ImageField";
import ListEditor from "@/components/admin/ListEditor";
import { Card, Field, Page, Row } from "@/components/admin/ui";

export default function HeroPage() {
  const { content, update } = useContentStore();
  const hero = content.hero;

  return (
    <Page title="Первый экран" description="Самый заметный блок сайта: заголовок, кнопки, лента фотографий и цифры.">
      <Card title="Заголовок">
        <Field
          label="Первая строка"
          onChange={(value) => update((draft) => void (draft.hero.title = value))}
          path="hero.title"
          value={hero.title}
        />
        <Field
          hint="Вторая строка заголовка — она выделена красным."
          label="Вторая строка"
          onChange={(value) => update((draft) => void (draft.hero.highlight = value))}
          path="hero.highlight"
          value={hero.highlight}
        />
        <Field
          label="Описание под заголовком"
          onChange={(value) => update((draft) => void (draft.hero.subtitle = value))}
          path="hero.subtitle"
          rows={3}
          value={hero.subtitle}
        />
      </Card>

      <Card title="Кнопки">
        <Row>
          <Field
            label="Главная кнопка"
            onChange={(value) => update((draft) => void (draft.hero.primaryCta.label = value))}
            path="hero.primaryCta.label"
            value={hero.primaryCta.label}
          />
          <Field
            label="Ссылка главной кнопки"
            onChange={(value) => update((draft) => void (draft.hero.primaryCta.href = value))}
            path="hero.primaryCta.href"
            value={hero.primaryCta.href}
          />
        </Row>
        <Row>
          <Field
            label="Вторая кнопка"
            onChange={(value) => update((draft) => void (draft.hero.secondaryCta.label = value))}
            path="hero.secondaryCta.label"
            value={hero.secondaryCta.label}
          />
          <Field
            label="Ссылка второй кнопки"
            onChange={(value) => update((draft) => void (draft.hero.secondaryCta.href = value))}
            path="hero.secondaryCta.href"
            value={hero.secondaryCta.href}
          />
        </Row>
      </Card>

      <Card title="Галочки под кнопками">
        <ListEditor
          addLabel="Добавить галочку"
          createItem={() => "Новое преимущество"}
          itemTitle={(item) => item}
          items={hero.advantages}
          onChange={(items) => update((draft) => void (draft.hero.advantages = items))}
          renderItem={(item, index) => (
            <Field
              label="Текст"
              onChange={(value) => update((draft) => void (draft.hero.advantages[index] = value))}
              path={`hero.advantages.${index}`}
              value={item}
            />
          )}
        />
      </Card>

      <Card title="Лента фотографий" description="Движущаяся карусель под заголовком. Минимум одна фотография.">
        <ListEditor
          addLabel="Добавить фотографию"
          createItem={() => ({ src: "", alt: "" })}
          itemTitle={(item, index) => item.alt || `Фото ${index + 1}`}
          items={hero.images}
          minItems={1}
          onChange={(items) => update((draft) => void (draft.hero.images = items))}
          renderItem={(item, index) => (
            <>
              <ImageField
                label="Фотография"
                onChange={(src) => update((draft) => void (draft.hero.images[index].src = src))}
                value={item.src}
              />
              <Field
                hint="Короткое описание фото для поисковиков."
                label="Описание"
                onChange={(value) => update((draft) => void (draft.hero.images[index].alt = value))}
                path={`hero.images.${index}.alt`}
                value={item.alt}
              />
            </>
          )}
        />
      </Card>

      <Card title="Цифры" description="Строка с показателями под каруселью.">
        <ListEditor
          addLabel="Добавить показатель"
          createItem={() => ({ value: "10+", label: "новый показатель" })}
          itemTitle={(item) => `${item.value} — ${item.label}`}
          items={hero.stats}
          onChange={(items) => update((draft) => void (draft.hero.stats = items))}
          renderItem={(item, index) => (
            <Row>
              <Field
                label="Значение"
                onChange={(value) => update((draft) => void (draft.hero.stats[index].value = value))}
                path={`hero.stats.${index}.value`}
                value={item.value}
              />
              <Field
                label="Подпись"
                onChange={(value) => update((draft) => void (draft.hero.stats[index].label = value))}
                path={`hero.stats.${index}.label`}
                value={item.label}
              />
            </Row>
          )}
        />
      </Card>
    </Page>
  );
}
