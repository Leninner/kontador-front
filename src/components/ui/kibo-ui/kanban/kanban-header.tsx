'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Check, MoreHorizontal, Pencil, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'

export type KanbanHeaderProps = {
  children?: ReactNode
  name?: string
  color?: string
  className?: string
  cardCount?: number
  onDeleteColumn?: () => void
  onMoveLeft?: () => void
  onMoveRight?: () => void
  onEditRules?: () => void
  onUpdateName?: (newName: string) => void
  onUpdateColor?: (newColor: string) => void
}

export const KanbanHeader = ({
  children,
  name,
  color,
  className,
  cardCount = 0,
  onDeleteColumn,
  onMoveLeft,
  onMoveRight,
  onEditRules,
  onUpdateName,
  onUpdateColor,
}: KanbanHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(name)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [tempColor, setTempColor] = useState(color || '#000000')

  if (children) {
    return children
  }

  const handleStartEditing = () => {
    setEditedName(name)
    setIsEditing(true)
  }

  const handleSave = () => {
    if (editedName?.trim() && editedName !== name) {
      onUpdateName?.(editedName)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedName(name)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempColor(e.target.value)
  }

  const handleSaveChanges = () => {
    if (editedName?.trim() && editedName !== name) {
      onUpdateName?.(editedName)
    }
    onUpdateColor?.(tempColor)
    setIsDialogOpen(false)
  }

  return (
    <div className={cn('flex shrink-0 items-center justify-between gap-2', className)}>
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        {isEditing ? (
          <div className="flex items-center gap-1">
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-6 w-32 text-sm"
              autoFocus
            />
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleSave}>
              <Check className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCancel}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <p className="m-0 font-semibold text-sm">{name}</p>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleStartEditing}>
              <Pencil className="h-3 w-3" />
            </Button>
          </div>
        )}
        <span className="text-muted-foreground text-xs">({cardCount})</span>
      </div>
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>Editar columna</DropdownMenuItem>
            <DropdownMenuItem onClick={onMoveLeft}>Mover a la izquierda</DropdownMenuItem>
            <DropdownMenuItem onClick={onMoveRight}>Mover a la derecha</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={onDeleteColumn}>
              Eliminar columna
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar columna</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre</label>
                <Input value={editedName} onChange={(e) => setEditedName(e.target.value)} className="w-full" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={tempColor}
                    onChange={handleColorChange}
                    className="h-8 w-8 rounded cursor-pointer"
                  />
                  <span className="text-sm text-muted-foreground">{tempColor}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Reglas</label>
                <Button variant="outline" className="w-full" onClick={onEditRules}>
                  Editar reglas
                </Button>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveChanges}>Guardar cambios</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
