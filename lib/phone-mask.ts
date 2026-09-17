// Маска российского номера для поля формы: +7 (XXX) XXX-XX-XX.
// Принимает что угодно — «8 927…», «+7927…», «927…», номер с пробелами
// из буфера обмена — и приводит к одному виду. Пустая строка — поле пустое.

export function formatRuPhone(raw: string): string {
  // «+7» — это префикс маски, а не часть номера: убираем его до разбора,
  // иначе при вводе в начало поля семёрка уезжает в номер.
  let digits = raw.replace("+7", "").replace(/\D/g, "");

  // Ведущая 8 или 7 — код страны, убираем; дальше не больше 10 цифр.
  if (digits.startsWith("8") || digits.startsWith("7")) {
    digits = digits.slice(1);
  }
  digits = digits.slice(0, 10);

  if (raw.trim() === "") {
    return "";
  }

  let out = "+7";
  if (digits.length > 0) out += ` (${digits.slice(0, 3)}`;
  if (digits.length >= 3) out += ")";
  if (digits.length > 3) out += ` ${digits.slice(3, 6)}`;
  if (digits.length > 6) out += `-${digits.slice(6, 8)}`;
  if (digits.length > 8) out += `-${digits.slice(8, 10)}`;

  return out;
}

export function isCompleteRuPhone(value: string): boolean {
  return value.replace(/\D/g, "").length === 11;
}
