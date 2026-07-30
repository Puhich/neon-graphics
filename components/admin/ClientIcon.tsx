"use client";

import { createElement } from "react";

import type { IconNode } from "@/lib/icons";

// Клиентская версия рендера lucide-иконки: узлы импортируются поимённо
// (`import { Store } from "lucide"`), поэтому в бандл попадают только
// использованные иконки.
export default function ClientIcon({
  node,
  className,
  strokeWidth = 1.8
}: {
  node: IconNode;
  className?: string;
  strokeWidth?: number;
}) {
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
      {node.map(([tag, attrs], index) => createElement(tag, { key: index, ...attrs }))}
    </svg>
  );
}
