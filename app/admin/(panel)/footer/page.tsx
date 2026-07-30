"use client";

import Link from "next/link";

import { useContentStore } from "@/components/admin/ContentProvider";
import ImageField from "@/components/admin/ImageField";
import ListEditor from "@/components/admin/ListEditor";
import { Card, Field, Note, Page, Row, Select } from "@/components/admin/ui";
import { copyrightLine, footerContactLinks } from "@/lib/site";

const socialOptions = [
  { value: "telegram", label: "Telegram" },
  { value: "max", label: "MAX" },
  { value: "vk", label: "VK" }
];

export default function FooterPage() {
  const { content, update } = useContentStore();
  const footer = content.footer;

  return (
    <Page title="Футер" description="Нижняя часть сайта: логотип, колонки ссылок, контакты и копирайт.">
      <Card title="Логотип и описание">
        <ImageField
          kind="brand"
          label="Логотип в футере"
          onChange={(src) => update((draft) => void (draft.footer.logoSrc = src))}
          ratio="logo"
          value={footer.logoSrc}
        />
        <Field
          label="Подпись логотипа"
          onChange={(value) => update((draft) => void (draft.footer.logoAlt = value))}
          path="footer.logoAlt"
          value={footer.logoAlt}
        />
        <Field
          label="Описание компании"
          onChange={(value) => update((draft) => void (draft.footer.about = value))}
          path="footer.about"
          rows={2}
          value={footer.about}
        />
      </Card>

      <Card title="Соцсети">
        <ListEditor
          addLabel="Добавить соцсеть"
          createItem={() => ({ label: "Telegram", href: "https://t.me/", icon: "telegram" as const })}
          itemTitle={(item) => item.label}
          items={footer.socials}
          onChange={(items) => update((draft) => void (draft.footer.socials = items))}
          renderItem={(item, index) => (
            <>
              <Row>
                <Field
                  label="Название"
                  onChange={(value) => update((draft) => void (draft.footer.socials[index].label = value))}
                  path={`footer.socials.${index}.label`}
                  value={item.label}
                />
                <Select
                  label="Иконка"
                  onChange={(value) =>
                    update((draft) => void (draft.footer.socials[index].icon = value as "telegram" | "max" | "vk"))
                  }
                  options={socialOptions}
                  value={item.icon}
                />
              </Row>
              <Field
                label="Ссылка"
                onChange={(value) => update((draft) => void (draft.footer.socials[index].href = value))}
                path={`footer.socials.${index}.href`}
                value={item.href}
              />
            </>
          )}
        />
      </Card>

      <Card title="Колонка «Разделы»">
        <Field
          label="Заголовок колонки"
          onChange={(value) => update((draft) => void (draft.footer.navTitle = value))}
          path="footer.navTitle"
          value={footer.navTitle}
        />
        <ListEditor
          addLabel="Добавить ссылку"
          createItem={() => ({ label: "Новый раздел", href: "#services" })}
          itemTitle={(item) => item.label}
          items={footer.nav}
          onChange={(items) => update((draft) => void (draft.footer.nav = items))}
          renderItem={(item, index) => (
            <Row>
              <Field
                label="Название"
                onChange={(value) => update((draft) => void (draft.footer.nav[index].label = value))}
                path={`footer.nav.${index}.label`}
                value={item.label}
              />
              <Field
                label="Ссылка"
                onChange={(value) => update((draft) => void (draft.footer.nav[index].href = value))}
                path={`footer.nav.${index}.href`}
                value={item.href}
              />
            </Row>
          )}
        />
      </Card>

      <Card title="Колонка «Услуги»">
        <Field
          label="Заголовок колонки"
          onChange={(value) => update((draft) => void (draft.footer.servicesTitle = value))}
          path="footer.servicesTitle"
          value={footer.servicesTitle}
        />
        <ListEditor
          addLabel="Добавить услугу"
          createItem={() => ({ label: "Новая услуга", href: "#services" })}
          itemTitle={(item) => item.label}
          items={footer.services}
          onChange={(items) => update((draft) => void (draft.footer.services = items))}
          renderItem={(item, index) => (
            <Row>
              <Field
                label="Название"
                onChange={(value) => update((draft) => void (draft.footer.services[index].label = value))}
                path={`footer.services.${index}.label`}
                value={item.label}
              />
              <Field
                label="Ссылка"
                onChange={(value) => update((draft) => void (draft.footer.services[index].href = value))}
                path={`footer.services.${index}.href`}
                value={item.href}
              />
            </Row>
          )}
        />
      </Card>

      <Card title="Колонка «Контакты»">
        <Field
          label="Заголовок колонки"
          onChange={(value) => update((draft) => void (draft.footer.contactsTitle = value))}
          path="footer.contactsTitle"
          value={footer.contactsTitle}
        />
        <ul className="grid gap-2 text-[14px] text-[var(--adm-text-2)]">
          {footerContactLinks(content.company).map((item) => (
            <li className="rounded-xl border border-[var(--adm-border)] bg-[var(--adm-sunken)] px-4 py-2.5" key={item.label}>
              {item.label}
            </li>
          ))}
        </ul>
        <Note>
          Берутся из{" "}
          <Link className="font-semibold text-[var(--adm-text)] underline underline-offset-2" href="/admin/company">
            реквизитов
          </Link>{" "}
          — одно изменение обновляет и футер, и шапку, и карточку контактов.
        </Note>
      </Card>

      <Card title="Нижняя строка">
        <p className="rounded-xl border border-[var(--adm-border)] bg-[var(--adm-sunken)] px-4 py-3 text-[13px] leading-[1.5] text-[var(--adm-muted)]">
          {copyrightLine(content.company)}
        </p>
        <Note>Копирайт собирается из реквизитов, год обновляется сам.</Note>
        <Row>
          <Field
            label="Текст ссылки на политику"
            onChange={(value) => update((draft) => void (draft.footer.privacy = value))}
            path="footer.privacy"
            value={footer.privacy}
          />
          <Field
            hint="По умолчанию /privacy — страница политики на этом же сайте."
            label="Ссылка на политику"
            onChange={(value) => update((draft) => void (draft.footer.privacyHref = value))}
            path="footer.privacyHref"
            value={footer.privacyHref}
          />
        </Row>
      </Card>
    </Page>
  );
}
