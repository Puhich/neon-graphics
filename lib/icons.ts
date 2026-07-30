import { icons } from "lucide";

// lucide отдаёт иконки как массив узлов [tag, attrs] под именами в PascalCase.
// В контенте храним привычные lucide-имена в kebab-case ("shield-check"),
// поэтому строим карту соответствия один раз при загрузке модуля.

export type IconNode = [tag: string, attrs: Record<string, string | number>][];

function toKebab(pascal: string): string {
  return pascal
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Za-z])(\d)/g, "$1-$2")
    .toLowerCase();
}

const iconsByName = new Map<string, IconNode>();

for (const [pascal, node] of Object.entries(icons)) {
  iconsByName.set(toKebab(pascal), node as IconNode);
}

export const FALLBACK_ICON = "sparkles";

export const iconNames: string[] = Array.from(iconsByName.keys()).sort();

export function getIconNode(name: string): IconNode {
  return iconsByName.get(name) ?? iconsByName.get(FALLBACK_ICON) ?? [];
}

export function hasIcon(name: string): boolean {
  return iconsByName.has(name);
}

// Разметка для превью иконок в админке (отдаётся API-роутом строкой).
export function iconSvgMarkup(name: string, size = 24, strokeWidth = 1.9): string {
  const body = getIconNode(name)
    .map(([tag, attrs]) => {
      const props = Object.entries(attrs)
        .map(([key, value]) => `${key}="${value}"`)
        .join(" ");

      return `<${tag} ${props} />`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}
