// Проверка адреса почты: не строгий RFC, а «похоже на адрес» — что-то@что-то.точка.
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}
