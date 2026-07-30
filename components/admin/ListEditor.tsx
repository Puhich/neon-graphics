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
import { GripVertical, Trash2 } from "lucide";

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
};

function SortableRow({
  id,
  title,
  onRemove,
  canRemove,
  children
}: {
  id: string;
  title: string;
  onRemove: () => void;
  canRemove: boolean;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-[#0f0f0d] ${isDragging ? "opacity-70 ring-1 ring-brand-accent/40" : ""}`}
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
        <button
          aria-label="Перетащить"
          className="cursor-grab touch-none rounded-lg p-1.5 text-[#6f6f6a] transition hover:text-white active:cursor-grabbing"
          type="button"
          {...attributes}
          {...listeners}
        >
          <ClientIcon className="h-4 w-4" node={GripVertical as IconNode} />
        </button>
        <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-[#c9c9c4]">{title}</span>
        {canRemove ? (
          <button
            aria-label="Удалить"
            className="rounded-lg p-1.5 text-[#6f6f6a] transition hover:text-brand-accent"
            onClick={onRemove}
            type="button"
          >
            <ClientIcon className="h-4 w-4" node={Trash2 as IconNode} />
          </button>
        ) : null}
      </div>
      <div className="grid gap-4 p-4">{children}</div>
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
  emptyLabel = "Пока пусто"
}: ListEditorProps<T>) {
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

  return (
    <div className="grid gap-3">
      {items.length === 0 ? <p className="text-[13px] text-[#6f6f6a]">{emptyLabel}</p> : null}

      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="grid gap-3">
            {items.map((item, index) => (
              <SortableRow
                canRemove={items.length > minItems}
                id={ids[index]}
                key={ids[index]}
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
        className="justify-self-start rounded-xl border border-white/15 px-4 py-2.5 text-[13px] font-semibold text-[#c9c9c4] transition hover:border-brand-accent/60 hover:text-white"
        onClick={() => onChange([...items, createItem()])}
        type="button"
      >
        + {addLabel}
      </button>
    </div>
  );
}
