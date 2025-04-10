'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  DndContext,
  rectIntersection,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import type { ReactNode } from 'react';

export type { DragEndEvent } from '@dnd-kit/core';

export type Status = {
  id: string;
  name: string;
  color: string;
};

export type KanbanBoardProps = {
  id: Status['id'];
  children: ReactNode;
  className?: string;
};

export const KanbanBoard = ({ id, children, className }: KanbanBoardProps) => {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      className={cn(
        'flex h-full w-[500px] min-h-[80vh] flex-none flex-col gap-2 rounded-md border bg-secondary p-2 text-xs shadow-sm outline-2',
        isOver ? 'outline-primary' : 'outline-transparent',
        className
      )}
      ref={setNodeRef}
    >
      {children}
    </div>
  );
};

export type KanbanCardProps = {
  id: string;
  name: string;
  description: string;
  index: number;
  parent: string;
  children?: ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
};

export const KanbanCard = ({
  id,
  name,
  description,
  index,
  parent,
  children,
  className,
  onClick,
}: KanbanCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { index, parent },
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) {
      onClick?.(event);
    }
  };

  return (
    <Card
      className={cn(
        'rounded-md p-3 shadow-sm',
        isDragging && 'cursor-grabbing',
        className
      )}
      style={{
        transform: transform
          ? `translateX(${transform.x}px) translateY(${transform.y}px)`
          : 'none',
      }}
      onClick={handleClick}
      {...listeners}
      {...attributes}
      ref={setNodeRef}
    >
      {children ?? <p className="m-0 font-medium text-sm">{name}</p>}
      <p className="m-0 text-muted-foreground text-xs">{description}</p>
    </Card>
  );
};

export type KanbanCardsProps = {
  children: ReactNode;
  className?: string;
};

export const KanbanCards = ({ children, className }: KanbanCardsProps) => (
  <div className={cn('flex flex-1 flex-col gap-2', className)}>{children}</div>
);

export type KanbanHeaderProps =
  | {
    children: ReactNode;
  }
  | {
    name: Status['name'];
    color: Status['color'];
    className?: string;
  };

export const KanbanHeader = (props: KanbanHeaderProps) =>
  'children' in props ? (
    props.children
  ) : (
    <div className={cn('flex shrink-0 items-center gap-2', props.className)}>
      <div
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: props.color }}
      />
      <p className="m-0 font-semibold text-sm">{props.name}</p>
    </div>
  );

export type KanbanProviderProps = {
  children: ReactNode;
  onDragEnd: (event: DragEndEvent) => void;
  className?: string;
};

export const KanbanProvider = ({
  children,
  onDragEnd,
  className,
}: KanbanProviderProps) => (
  <DndContext collisionDetection={rectIntersection} onDragEnd={onDragEnd}>
    <div
      className={cn(
        'flex gap-4 overflow-x-auto p-4 w-[85vw]',
        className
      )}
    >
      {children}
    </div>
  </DndContext>
);
