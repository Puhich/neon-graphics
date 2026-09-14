"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronRight, ChevronUp, GripVertical, Trash2 } from "lucide";
import { useId, useState } from "react";

import ClientIcon from "@/components/admin/ClientIcon";
import type { IconNode } from "@/lib/icons";

// Универсальный редактор списков: добавить, удалить, перетащить.
// Используется для меню, услуг, отзывов, вопросов, фотографий и т.д.

type ListEditorProps<T> = {
  items: T[];
  onChange: (items: T[]) => void;
  createItem: () => T;
  renderItem: (item: T, index: number) => React.ReactNode;
  itemTitle: (item: T, index: number) => string;
  addLabel: string;
  minItems?: number;
  emptyLabel?: string;
  /** Сворачивать элементы в одну строку с заголовком. Для списков из одного поля — выключить. */
  collapsible?: boolean;
};

function SortableRow({
  id,
  title,
  onRemove,
  onMove,
  canRemove,
  canMoveUp,
  canMoveDown,
  collapsible,
  expanded,
  onToggle,
  children
}: {
  id: string;
  title: string;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
  canRemove: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  collapsible: boolean;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <div
      className={`rounded-2xl border border-[var(--adm-border)] bg-[var(--adm-sunken)] ${isDragging ? "opacity-70 ring-1 ring-brand-accent/40" : ""}`}
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <div className={`flex items-center gap-2 px-3 py-2.5 ${collapsible && expanded ? "border-b border-[var(--adm-border)]" : ""}`}>
        <button
          aria-label="Перетащить"
          className="cursor-grab touch-none rounded-lg p-1.5 text-[var(--adm-faint)] transition hover:text-[var(--adm-text)] active:cursor-grabbing"
          type="button"
          {...attributes}
          {...listeners}
        >
          <ClientIcon className="h-4 w-4" node={GripVertical as IconNode} />
        </button>
        {collapsible ? (
          <button
            aria-expanded={expanded}
            className="flex min-w-0 flex-1 items-center gap-2 rounded-lg py-1 text-left text-[13px] font-semibold text-[var(--adm-text-2)] transition hover:text-[var(--adm-text)]"
            onClick={onToggle}
            type="button"
          >
            <ClientIcon
              className={`h-4 w-4 shrink-0 text-[var(--adm-faint)] transition-transform ${expanded ? "rotate-90" : ""}`}
              node={ChevronRight as IconNode}
            />
            <span className="truncate">{title}</span>
          </button>
        ) : (
          <div className="min-w-0 flex-1">{children}</div>
        )}
        <button
          aria-label="Переместить выше"
          className="rounded-lg p-1.5 text-[var(--adm-faint)] transition hover:text-[var(--adm-text)] disabled:opacity-30 disabled:hover:text-[var(--adm-faint)]"
          disabled={!canMoveUp}
          onClick={() => onMove(-1)}
          type="button"
        >
          <ClientIcon className="h-4 w-4" node={ChevronUp as IconNode} />
        </button>
        <button
          aria-label="Переместить ниже"
          className="rounded-lg p-1.5 text-[var(--adm-faint)] transition hover:text-[var(--adm-text)] disabled:opacity-30 disabled:hover:text-[var(--adm-faint)]"
          disabled={!canMoveDown}
          onClick={() => onMove(1)}
          type="button"
        >
          <ClientIcon className="h-4 w-4" node={ChevronDown as IconNode} />
        </button>
        {canRemove ? (
          <button
            aria-label="Удалить"
            className="rounded-lg p-1.5 text-[var(--adm-faint)] transition hover:text-brand-accent"
            onClick={onRemove}
            type="button"
          >
            <ClientIcon className="h-4 w-4" node={Trash2 as IconNode} />
          </button>
        ) : null}
      </div>
      {collapsible && expanded ? <div className="grid gap-4 p-4">{children}</div> : null}
    </div>
  );
}

export default function ListEditor<T>({
  items,
  onChange,
  createItem,
  renderItem,
  itemTitle,
  addLabel,
  minItems = 0,
  emptyLabel = "Пока пусто",
  collapsible = true
}: ListEditorProps<T>) {
  // Какие элементы раскрыты. По умолчанию всё свёрнуто, чтобы длинные
  // списки (услуги, отзывы, фото) не превращали страницу в простыню.
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const isExpanded = (id: string) => !collapsible || expandedIds.has(id);
  const toggle = (id: string) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  // Свой стабильный id: иначе dnd-kit нумерует контексты по порядку
  // монтирования и разметка сервера не совпадает с клиентской.
  const dndId = useId();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const ids = items.map((_, index) => `item-${index}`);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));

    if (from >= 0 && to >= 0) {
      onChange(arrayMove(items, from, to));
    }
  };

  const allExpanded = ids.length > 0 && ids.every((id) => expandedIds.has(id));

  return (
    <div className="grid gap-3">
      {items.length === 0 ? <p className="text-[13px] text-[var(--adm-faint)]">{emptyLabel}</p> : null}
      {collapsible && items.length > 1 ? (
        <button
          className="justify-self-end text-[12px] font-semibold text-[var(--adm-faint)] transition hover:text-[var(--adm-text)]"
          onClick={() => setExpandedIds(allExpanded ? new Set() : new Set(ids))}
          type="button"
        >
          {allExpanded ? "Свернуть все" : "Развернуть все"}
        </button>
      ) : null}

      <DndContext
        collisionDetection={closestCenter}
        id={dndId}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="grid gap-3">
            {items.map((item, index) => (
              <SortableRow
                canMoveDown={index < items.length - 1}
                canMoveUp={index > 0}
                canRemove={items.length > minItems}
                collapsible={collapsible}
                expanded={isExpanded(ids[index])}
                id={ids[index]}
                key={ids[index]}
                onToggle={() => toggle(ids[index])}
                onMove={(direction) => onChange(arrayMove(items, index, index + direction))}
                onRemove={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
                title={itemTitle(item, index) || `Элемент ${index + 1}`}
              >
                {renderItem(item, index)}
              </SortableRow>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        className="justify-self-start rounded-xl border border-[var(--adm-border-strong)] px-4 py-2.5 text-[13px] font-semibold text-[var(--adm-text-2)] transition hover:border-brand-accent/60 hover:text-[var(--adm-text)]"
        onClick={() => {
          onChange([...items, createItem()]);
          setExpandedIds((prev) => new Set(prev).add(`item-${items.length}`));
        }}
        type="button"
      >
        + {addLabel}
      </button>
    </div>
  );
}
