"use client";

import Link from "next/link";

import { useContentStore } from "@/components/admin/ContentProvider";
import ImageField from "@/components/admin/ImageField";
import ListEditor from "@/components/admin/ListEditor";
import { Card, Field, Note, Page, Row, Select } from "@/components/admin/ui";
import { topBarItems } from "@/lib/site";

const socialOptions = [
  { value: "telegram", label: "Telegram" },
  { value: "max", label: "MAX" },
  { value: "vk", label: "VK" }
];

export default function HeaderPage() {
  const { content, update } = useContentStore();
  const nav = content.nav;

  return (
    <Page title="Шапка и меню" description="Логотип, пункты меню, соцсети и кнопка в верхней части сайта.">
      <Card title="Верхняя строка" description="Телефон, адрес и режим работы над меню.">
        <ul className="grid gap-2">
          {topBarItems(content.company).map((item) => (
            <li className="rounded-xl border border-white/10 bg-[#0f0f0d] px-4 py-2.5 text-[14px] text-[#c9c9c4]" key={item}>
              {item}
            </li>
          ))}
        </ul>
        <Note>
          Эти три строки берутся из{" "}
          <Link className="font-semibold text-white underline underline-offset-2" href="/admin/company">
            реквизитов
          </Link>{" "}
          — там же и меняются, чтобы телефон и адрес совпадали во всех местах сайта.
        </Note>
      </Card>

      <Card title="Логотип">
        <ImageField
          hint="Светлый логотип для тёмной шапки. Лучше PNG или SVG с прозрачным фоном."
          kind="brand"
          label="Логотип в шапке"
          onChange={(src) => update((draft) => void (draft.nav.logoSrc = src))}
          ratio="logo"
          value={nav.logoSrc}
        />
        <Field
          hint="Описание логотипа для поисковиков и читалок."
          label="Подпись логотипа"
          onChange={(value) => update((draft) => void (draft.nav.logoAlt = value))}
          path="nav.logoAlt"
          value={nav.logoAlt}
        />
      </Card>

      <Card title="Пункты меню" description="Порядок можно менять перетаскиванием.">
        <ListEditor
          addLabel="Добавить пункт"
          createItem={() => ({ label: "Новый пункт", href: "#services" })}
          itemTitle={(item) => item.label}
          items={nav.links}
          onChange={(items) => update((draft) => void (draft.nav.links = items))}
          renderItem={(item, index) => (
            <Row>
              <Field
                label="Название"
                onChange={(value) => update((draft) => void (draft.nav.links[index].label = value))}
                path={`nav.links.${index}.label`}
                value={item.label}
              />
              <Field
                hint="Ссылка на секцию сайта, например #services"
                label="Ссылка"
                onChange={(value) => update((draft) => void (draft.nav.links[index].href = value))}
                path={`nav.links.${index}.href`}
                value={item.href}
              />
            </Row>
          )}
        />
      </Card>

      <Card title="Соцсети" description="Иконки рядом с меню и в футере — свои для каждой площадки.">
        <ListEditor
          addLabel="Добавить соцсеть"
          createItem={() => ({ label: "Telegram", href: "https://t.me/", icon: "telegram" as const })}
          itemTitle={(item) => item.label}
          items={nav.socials}
          onChange={(items) => update((draft) => void (draft.nav.socials = items))}
          renderItem={(item, index) => (
            <>
              <Row>
                <Field
                  label="Название"
                  onChange={(value) => update((draft) => void (draft.nav.socials[index].label = value))}
                  path={`nav.socials.${index}.label`}
                  value={item.label}
                />
                <Select
                  label="Иконка"
                  onChange={(value) =>
                    update((draft) => void (draft.nav.socials[index].icon = value as "telegram" | "max" | "vk"))
                  }
                  options={socialOptions}
                  value={item.icon}
                />
              </Row>
              <Field
                hint="Полная ссылка, например https://t.me/neongrafiks"
                label="Ссылка"
                onChange={(value) => update((draft) => void (draft.nav.socials[index].href = value))}
                path={`nav.socials.${index}.href`}
                value={item.href}
              />
            </>
          )}
        />
      </Card>

      <Card title="Кнопки и подписи">
        <Row>
          <Field
            label="Текст кнопки"
            onChange={(value) => update((draft) => void (draft.nav.cta.label = value))}
            path="nav.cta.label"
            value={nav.cta.label}
          />
          <Field
            label="Ссылка кнопки"
            onChange={(value) => update((draft) => void (draft.nav.cta.href = value))}
            path="nav.cta.href"
            value={nav.cta.href}
          />
        </Row>
        <Row>
          <Field
            hint="Подпись круглой кнопки звонка (её читают программы чтения с экрана)."
            label="Подпись кнопки звонка"
            onChange={(value) => update((draft) => void (draft.nav.callLabel = value))}
            path="nav.callLabel"
            value={nav.callLabel}
          />
          <Field
            label="Подпись «открыть меню»"
            onChange={(value) => update((draft) => void (draft.nav.menuOpenLabel = value))}
            path="nav.menuOpenLabel"
            value={nav.menuOpenLabel}
          />
        </Row>
        <Field
          label="Подпись «закрыть меню»"
          onChange={(value) => update((draft) => void (draft.nav.menuCloseLabel = value))}
          path="nav.menuCloseLabel"
          value={nav.menuCloseLabel}
        />
      </Card>
    </Page>
  );
}
