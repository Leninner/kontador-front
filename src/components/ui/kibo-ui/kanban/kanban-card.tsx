'use client'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useDraggable } from '@dnd-kit/core'
import type { ReactNode } from 'react'

export type KanbanCardProps = {
  id: string
  name: string
  index: number
  parent: string
  children?: ReactNode
  className?: string
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
}

export const KanbanCard = ({ id, name, index, parent, children, className, onClick }: KanbanCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { index, parent },
  })

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) {
      onClick?.(event)
    }
  }

  return (
    <Card
      className={cn('rounded-md p-3 shadow-sm', isDragging && 'cursor-grabbing', className)}
      style={{
        transform: transform ? `translateX(${transform.x}px) translateY(${transform.y}px)` : 'none',
      }}
      onClick={handleClick}
      {...listeners}
      {...attributes}
      ref={setNodeRef}
    >
      {children ?? <p className="m-0 font-medium text-sm">{name}</p>}
    </Card>
  )
}
