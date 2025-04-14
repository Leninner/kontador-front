'use client'

import { cn } from '@/lib/utils'
import { DndContext, rectIntersection, useDroppable } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import type { ReactNode } from 'react'

export type { DragEndEvent } from '@dnd-kit/core'

export type Status = {
  id: string
  name: string
  color: string
}

export type KanbanBoardProps = {
  id: Status['id']
  children: ReactNode
  className?: string
}

export const KanbanBoard = ({ id, children, className }: KanbanBoardProps) => {
  const { isOver, setNodeRef } = useDroppable({ id })

  return (
    <div
      className={cn(
        'flex h-full w-[500px] min-h-[80vh] flex-none flex-col gap-2 rounded-md border bg-secondary p-2 text-xs shadow-sm outline-2',
        isOver ? 'outline-primary' : 'outline-transparent',
        className,
      )}
      ref={setNodeRef}
    >
      {children}
    </div>
  )
}

export type KanbanCardsProps = {
  children: ReactNode
  className?: string
}

export const KanbanCards = ({ children, className }: KanbanCardsProps) => (
  <div className={cn('flex flex-1 flex-col gap-2', className)}>{children}</div>
)

export type KanbanProviderProps = {
  children: ReactNode
  onDragEnd: (event: DragEndEvent) => void
  className?: string
}

export const KanbanProvider = ({ children, onDragEnd, className }: KanbanProviderProps) => (
  <DndContext collisionDetection={rectIntersection} onDragEnd={onDragEnd}>
    <div className={cn('flex gap-4 overflow-x-auto p-4 w-[85vw]', className)}>{children}</div>
  </DndContext>
)
