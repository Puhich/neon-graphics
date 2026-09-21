"use client";

import { useContentStore } from "@/components/admin/ContentProvider";
import ListEditor from "@/components/admin/ListEditor";
import { Card, Field, Page, Row, Select } from "@/components/admin/ui";

const socialOptions = [
  { value: "telegram", label: "Telegram" },
  { value: "max", label: "MAX" },
  { value: "vk", label: "VK" }
];

export default function CompanyPage() {
  const { content, update } = useContentStore();
  const company = content.company;

  return (
    <Page
      title="Реквизиты"
      description="Эти данные подставляются во все места сайта сразу: верхняя строка, карточка контактов, футер, кнопка звонка и копирайт. Менять их нужно только здесь."
    >
      <Card title="Связь">
        <Row>
          <Field
            hint="Как на сайте. Ссылка для звонка соберётся сама."
            label="Телефон"
            onChange={(value) => update((draft) => void (draft.company.phone = value))}
            path="company.phone"
            type="tel"
            value={company.phone}
          />
          <Field
            label="Email"
            onChange={(value) => update((draft) => void (draft.company.email = value))}
            path="company.email"
            type="email"
            value={company.email}
          />
        </Row>
        <Row>
          <Field
            hint="Полный адрес — карточка контактов."
            label="Адрес"
            onChange={(value) => update((draft) => void (draft.company.address = value))}
            path="company.address"
            value={company.address}
          />
          <Field
            hint="Короткий адрес — верхняя строка и футер."
            label="Адрес кратко"
            onChange={(value) => update((draft) => void (draft.company.addressShort = value))}
            path="company.addressShort"
            value={company.addressShort}
          />
        </Row>
        <Row>
          <Field
            hint="Например: Пн - Пт: 9:00 - 17:00"
            label="Режим работы"
            onChange={(value) => update((draft) => void (draft.company.schedule = value))}
            path="company.schedule"
            value={company.schedule}
          />
          <Field
            hint="Короткий вариант для верхней строки."
            label="Режим работы кратко"
            onChange={(value) => update((draft) => void (draft.company.scheduleShort = value))}
            path="company.scheduleShort"
            value={company.scheduleShort}
          />
        </Row>
      </Card>

      <Card title="Соцсети">
        <ListEditor
          addLabel="Добавить соцсеть"
          createItem={() => ({ label: "Telegram", href: "https://t.me/", icon: "telegram" as const })}
          itemTitle={(item) => item.label}
          items={company.socials}
          onChange={(items) => update((draft) => void (draft.company.socials = items))}
          renderItem={(item, index) => (
            <>
              <Row>
                <Field
                  label="Название"
                  onChange={(value) => update((draft) => void (draft.company.socials[index].label = value))}
                  path={`company.socials.${index}.label`}
                  value={item.label}
                />
                <Select
                  label="Иконка"
                  onChange={(value) =>
                    update((draft) => void (draft.company.socials[index].icon = value as "telegram" | "max" | "vk"))
                  }
                  options={socialOptions}
                  value={item.icon}
                />
              </Row>
              <Field
                label="Ссылка"
                onChange={(value) => update((draft) => void (draft.company.socials[index].href = value))}
                path={`company.socials.${index}.href`}
                value={item.href}
              />
            </>
          )}
        />
      </Card>

      <Card title="Юридические данные">
        <Row>
          <Field
            label="Название"
            onChange={(value) => update((draft) => void (draft.company.name = value))}
            path="company.name"
            value={company.name}
          />
          <Field
            label="Юридическое название"
            onChange={(value) => update((draft) => void (draft.company.legalName = value))}
            path="company.legalName"
            value={company.legalName}
          />
        </Row>
        <Row>
          <Field
            label="ИНН"
            onChange={(value) => update((draft) => void (draft.company.inn = value))}
            path="company.inn"
            value={company.inn}
          />
          <Field
            label="ОГРН"
            onChange={(value) => update((draft) => void (draft.company.ogrn = value))}
            path="company.ogrn"
            value={company.ogrn}
          />
        </Row>
        <Field
          label="Юридический адрес"
          onChange={(value) => update((draft) => void (draft.company.legalAddress = value))}
          path="company.legalAddress"
          value={company.legalAddress}
        />
        <Row>
          <Field
            hint="Для поисковиков и карточки организации."
            label="Город"
            onChange={(value) => update((draft) => void (draft.company.city = value))}
            path="company.city"
            value={company.city}
          />
          <Field
            label="Год основания"
            onChange={(value) => update((draft) => void (draft.company.foundedYear = value))}
            path="company.foundedYear"
            value={company.foundedYear}
          />
        </Row>
      </Card>
    </Page>
  );
}
