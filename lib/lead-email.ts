// HTML-письмо с заявкой: тёмная шапка в цветах сайта, контакты жирным и
// кликабельные, сообщение отдельным блоком. Только инлайновые стили и
// таблицы — так письмо одинаково выглядит в Яндекс.Почте, Mail.ru,
// Gmail и на телефоне. Логотип не вставляем: картинки в письмах часто
// блокируются, а текстовая шапка читается всегда.

export type LeadEmailData = {
  name: string;
  phone: string;
  email: string;
  message: string;
  time: string;
  photoCount: number;
};

function esc(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function digits(phone: string): string {
  return phone.replace(/\D/g, "");
}

function telHref(phone: string): string {
  return `tel:+${digits(phone)}`;
}

const button = (href: string, label: string, primary = false) =>
  `<a href="${href}" style="display:inline-block;${
    primary ? "background:#cc1a2c;color:#ffffff;" : "background:#f1f1ef;color:#1a1a18;"
  }font-size:14px;font-weight:700;text-decoration:none;padding:12px 18px;border-radius:10px;margin:0 8px 8px 0;">${label}</a>`;

export function leadEmailHtml(d: LeadEmailData): string {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #ececea;color:#8a8a86;font-size:13px;width:110px;vertical-align:top;">${label}</td>
      <td style="padding:10px 0;border-bottom:1px solid #ececea;color:#1a1a18;font-size:16px;font-weight:700;vertical-align:top;">${value}</td>
    </tr>`;

  const photos = d.photoCount > 0 ? row("Фото", `${d.photoCount} во вложении`) : "";

  const message = d.message
    ? `
    <tr>
      <td colspan="2" style="padding:18px 0 0;">
        <div style="color:#8a8a86;font-size:13px;margin-bottom:8px;">Сообщение</div>
        <div style="background:#f5f5f3;border:1px solid #ececea;border-radius:12px;padding:14px 16px;color:#1a1a18;font-size:15px;line-height:1.55;white-space:pre-wrap;">${esc(d.message)}</div>
      </td>
    </tr>`
    : "";

  return `<!doctype html>
<html lang="ru">
<body style="margin:0;padding:0;background:#f1f1ef;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f1ef;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e2e2df;border-radius:16px;overflow:hidden;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
        <tr>
          <td style="padding:26px 28px 14px;">
            <div style="color:#1a1a18;font-size:22px;font-weight:800;">Новая заявка с сайта</div>
          </td>
        </tr>
        <tr>
          <td style="padding:0 28px 24px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${row("Имя", esc(d.name))}
              ${row("Телефон", `<a href="${telHref(d.phone)}" style="color:#cc1a2c;text-decoration:none;">${esc(d.phone)}</a>`)}
              ${d.email ? row("Email", `<a href="mailto:${esc(d.email)}" style="color:#cc1a2c;text-decoration:none;">${esc(d.email)}</a>`) : ""}
              ${photos}
              ${message}
            </table>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:22px;">
              <tr>
                <td>
                  ${button(telHref(d.phone), "Позвонить", true)}${button(`https://t.me/+${digits(d.phone)}`, "Telegram")}${button(`https://wa.me/${digits(d.phone)}`, "WhatsApp")}
                </td>
              </tr>
              <tr>
                <td style="padding-top:10px;color:#8a8a86;font-size:12px;">Заявка отправлена ${esc(d.time)}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
