import { createElement } from "react";

import { getIconNode } from "@/lib/icons";

type IconProps = {
  name: string;
  className?: string;
  strokeWidth?: number;
};

// Серверный рендер иконки lucide по имени: клиентского JS не добавляется,
// а админка может подставить любое имя из набора.
export default function Icon({ name, className, strokeWidth = 1.9 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      viewBox="0 0 24 24"
    >
      {getIconNode(name).map(([tag, attrs], index) => createElement(tag, { key: index, ...attrs }))}
    </svg>
  );
}
