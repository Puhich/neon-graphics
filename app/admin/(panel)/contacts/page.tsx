"use client";

import Link from "next/link";

import { useContentStore } from "@/components/admin/ContentProvider";
import ListEditor from "@/components/admin/ListEditor";
import { Card, Field, Note, NumberField, Page, Row } from "@/components/admin/ui";

export default function ContactsPage() {
  const { content, update } = useContentStore();
  const contacts = content.contacts;

  return (
    <Page title="Контакты и карта" description="Секция с картой Яндекса и карточкой контактов.">
      <Card title="Данные в карточке">
        <ul className="grid gap-2 text-[14px] text-[#c9c9c4]">
          <li className="rounded-xl border border-white/10 bg-[#0f0f0d] px-4 py-2.5">{content.company.phone}</li>
          <li className="rounded-xl border border-white/10 bg-[#0f0f0d] px-4 py-2.5">{content.company.email}</li>
          <li className="rounded-xl border border-white/10 bg-[#0f0f0d] px-4 py-2.5">{content.company.address}</li>
          <li className="rounded-xl border border-white/10 bg-[#0f0f0d] px-4 py-2.5">{content.company.schedule}</li>
        </ul>
        <Note>
          Сами значения меняются в{" "}
          <Link className="font-semibold text-white underline underline-offset-2" href="/admin/company">
            реквизитах
          </Link>
          . Здесь настраиваются только подписи над ними.
        </Note>
        <Row>
          <Field
            label="Заголовок карточки"
            onChange={(value) => update((draft) => void (draft.contacts.title = value))}
            path="contacts.title"
            value={contacts.title}
          />
          <Field
            label="Подпись у телефона"
            onChange={(value) => update((draft) => void (draft.contacts.phoneLabel = value))}
            path="contacts.phoneLabel"
            value={contacts.phoneLabel}
          />
        </Row>
        <Row>
          <Field
            label="Подпись у почты"
            onChange={(value) => update((draft) => void (draft.contacts.emailLabel = value))}
            path="contacts.emailLabel"
            value={contacts.emailLabel}
          />
          <Field
            label="Подпись у адреса"
            onChange={(value) => update((draft) => void (draft.contacts.addressLabel = value))}
            path="contacts.addressLabel"
            value={contacts.addressLabel}
          />
        </Row>
        <Field
          label="Подпись у режима работы"
          onChange={(value) => update((draft) => void (draft.contacts.scheduleLabel = value))}
          path="contacts.scheduleLabel"
          value={contacts.scheduleLabel}
        />
      </Card>

      <Card title="Карта" description="Координаты можно взять на Яндекс.Картах: правый клик по точке → «Что здесь?».">
        <Row>
          <NumberField
            hint="Северная широта, например 53.534555"
            label="Широта метки"
            onChange={(value) => update((draft) => void (draft.contacts.mapCenter[0] = value))}
            step={0.000001}
            value={contacts.mapCenter[0]}
          />
          <NumberField
            hint="Восточная долгота, например 49.257789"
            label="Долгота метки"
            onChange={(value) => update((draft) => void (draft.contacts.mapCenter[1] = value))}
            step={0.000001}
            value={contacts.mapCenter[1]}
          />
        </Row>
        <Row>
          <NumberField
            hint="Центр карты сдвинут, чтобы метку не закрывала карточка контактов."
            label="Широта центра карты"
            onChange={(value) => update((draft) => void (draft.contacts.mapWidgetCenter[0] = value))}
            step={0.000001}
            value={contacts.mapWidgetCenter[0]}
          />
          <NumberField
            label="Долгота центра карты"
            onChange={(value) => update((draft) => void (draft.contacts.mapWidgetCenter[1] = value))}
            step={0.000001}
            value={contacts.mapWidgetCenter[1]}
          />
        </Row>
        <Row>
          <NumberField
            hint="От 1 (весь мир) до 21 (дом). Сейчас 15."
            label="Приближение"
            onChange={(value) => update((draft) => void (draft.contacts.mapZoom = value))}
            value={contacts.mapZoom}
          />
          <Field
            label="Описание карты"
            onChange={(value) => update((draft) => void (draft.contacts.mapAlt = value))}
            path="contacts.mapAlt"
            value={contacts.mapAlt}
          />
        </Row>
        <Row>
          <Field
            hint="Кнопка показывается, если посетитель отказался от cookie."
            label="Кнопка «показать карту»"
            onChange={(value) => update((draft) => void (draft.contacts.mapLoadLabel = value))}
            path="contacts.mapLoadLabel"
            value={contacts.mapLoadLabel}
          />
          <Field
            label="Пояснение к кнопке"
            onChange={(value) => update((draft) => void (draft.contacts.mapNote = value))}
            path="contacts.mapNote"
            rows={2}
            value={contacts.mapNote}
          />
        </Row>
      </Card>

      <Card title="Кнопки карт" description="Ссылки на карточки компании в Яндекс.Картах и 2ГИС.">
        <ListEditor
          addLabel="Добавить кнопку"
          createItem={() => ({ label: "Мы на карте", href: "https://", icon: "/icons/yamaps.svg" })}
          itemTitle={(item) => item.label}
          items={contacts.mapButtons}
          onChange={(items) => update((draft) => void (draft.contacts.mapButtons = items))}
          renderItem={(item, index) => (
            <>
              <Row>
                <Field
                  label="Название"
                  onChange={(value) => update((draft) => void (draft.contacts.mapButtons[index].label = value))}
                  path={`contacts.mapButtons.${index}.label`}
                  value={item.label}
                />
                <Field
                  hint="/icons/yamaps.svg или /icons/2gis.svg"
                  label="Иконка"
                  onChange={(value) => update((draft) => void (draft.contacts.mapButtons[index].icon = value))}
                  path={`contacts.mapButtons.${index}.icon`}
                  value={item.icon}
                />
              </Row>
              <Field
                label="Ссылка"
                onChange={(value) => update((draft) => void (draft.contacts.mapButtons[index].href = value))}
                path={`contacts.mapButtons.${index}.href`}
                value={item.href}
              />
            </>
          )}
        />
      </Card>
    </Page>
  );
}
