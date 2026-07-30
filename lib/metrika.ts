"use client";

// Тонкая обёртка над Яндекс.Метрикой: счётчик может быть не подключён
// (пустое поле в админке) — тогда вызовы просто ничего не делают.

declare global {
  interface Window {
    ym?: (counterId: number, action: string, ...rest: unknown[]) => void;
  }
}

export function reachGoal(metrikaId: string, goal: string): void {
  const counterId = Number(metrikaId);

  if (!counterId || typeof window === "undefined" || typeof window.ym !== "function") {
    return;
  }

  window.ym(counterId, "reachGoal", goal);
}
