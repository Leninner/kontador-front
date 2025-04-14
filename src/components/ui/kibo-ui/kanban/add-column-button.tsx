'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export type AddColumnButtonProps = {
  className?: string
  onClick: () => void
}

export const AddColumnButton = ({ className, onClick }: AddColumnButtonProps) => {
  return (
    <Button
      variant="outline"
      className={cn(
        'flex h-full w-[500px] min-h-[80vh] flex-none flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-secondary p-4 text-xs shadow-sm',
        className,
      )}
      onClick={onClick}
    >
      <Plus className="h-6 w-6" />
      <span>Add new column</span>
    </Button>
  )
}
