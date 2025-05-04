'use client'

import { KanbanBoard, KanbanCards, KanbanProvider } from '@/components/ui/kibo-ui/kanban'
import { TaskPanel } from '@/components/ui/kibo-ui/kanban/TaskPanel'
import type { DragEndEvent } from '@/components/ui/kibo-ui/kanban'
import { useState } from 'react'
import { useBoards } from '@/modules/boards'
import { BoardColumnCard, CreateColumnRulesDto } from '@/modules/boards/interfaces/board.interface'
import { KanbanHeader } from '@/components/ui/kibo-ui/kanban/kanban-header'
import { KanbanCard } from '@/components/ui/kibo-ui/kanban/kanban-card'
import { DateFormatter } from '@/lib/date-formatters'
import { CreateColumnDialog } from '@/components/ui/kibo-ui/kanban/create-column-dialog'
import { useCard } from '@/modules/boards/hooks/useCard'
import { useColumnRules } from '@/modules/boards/hooks/useColumnRules'
import { CreateCardForm } from '@/components/ui/kibo-ui/kanban/create-card-form'
import { ColumnRulesModal } from '@/components/ColumnRulesModal'
import { ColumnRules, Rule } from '@/modules/boards/interfaces/board.interface'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
const dateFormatter = DateFormatter.getInstance()

export const BoardPage = () => {
  const { boardData, createColumn, updateColumn } = useBoards()
  const { updateColumnRules } = useColumnRules()
  const queryClient = useQueryClient()
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const { updateCard, createCard } = useCard(selectedCardId || '')
  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(false)
  const [activeFormColumnId, setActiveFormColumnId] = useState<string | null>(null)
  const [columnRulesModalState, setColumnRulesModalState] = useState<{
    open: boolean
    columnId: string
    columnName: string
    rules?: ColumnRules
  }>({
    open: false,
    columnId: '',
    columnName: '',
    rules: undefined,
  })
  const MAX_VISIBLE_LABELS = 3

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event

    if (!over) {
      return
    }

    const column = boardData.columns.find((column) => column.name === over.id)
    const card = column?.cards.find((card) => card.id === active.id)

    // If the card is in the same column, do nothing
    if (!column || card) {
      return
    }

    setSelectedCardId(active.id as string)

    updateCard.mutate({
      id: active.id as string,
      data: {
        columnId: column.id,
      },
    })
  }

  const handleCardClick = (card: BoardColumnCard) => {
    setSelectedCardId(card.id)
    setIsTaskPanelOpen(true)
  }

  const handleAddColumn = (name: string) => {
    createColumn.mutate({
      name,
      boardId: boardData.id || '',
    })
  }

  const handleUpdateColumnName = (columnId: string, newName: string) => {
    updateColumn.mutate({
      id: columnId,
      data: {
        name: newName,
      },
    })
  }

  const handleUpdateColumnColor = (columnId: string, newColor: string) => {
    updateColumn.mutate({
      id: columnId,
      data: { color: newColor },
    })
  }

  const handleCloseTaskPanel = () => {
    setIsTaskPanelOpen(false)
  }

  const handleCreateCard = (columnId: string, cardData: { name: string; description: string; dueDate: Date }) => {
    createCard.mutate({
      ...cardData,
      columnId,
    })
  }

  const handleEditRules = (columnId: string) => {
    const column = boardData.columns.find((col) => col.id === columnId)
    if (!column) return

    // Convert from old format to new format if needed
    const columnWithRules = column as { rules?: Record<string, unknown> }
    let rules = columnWithRules.rules as ColumnRules | undefined

    // If rules exist but in old format (has triggers/actions arrays), convert them
    if (rules && 'triggers' in rules && 'actions' in rules && !('rules' in rules)) {
      const oldRules = rules as unknown as {
        enabled: boolean
        triggers: Array<{ type: string; config?: Record<string, unknown> }>
        conditions: Array<{ type: string; config?: Record<string, unknown> }>
        actions: Array<{ type: string; config?: Record<string, unknown> }>
      }

      // Create a new Rule object for each trigger-action pair
      const newRules: Rule[] = []

      // If there's at least one trigger and one action, create a rule
      if (oldRules.triggers.length > 0 && oldRules.actions.length > 0) {
        const trigger = oldRules.triggers[0]
        const action = oldRules.actions[0]

        newRules.push({
          id: 'rule-1',
          name: 'Automated Rule',
          enabled: true,
          trigger: { type: trigger.type, config: trigger.config || {} },
          conditions: oldRules.conditions,
          action: { type: action.type, config: action.config || {} },
        })
      }

      // Create the new rules structure
      rules = {
        enabled: oldRules.enabled,
        rules: newRules,
      }
    }

    setColumnRulesModalState({
      open: true,
      columnId: column.id,
      columnName: column.name,
      rules: rules,
    })
  }

  const handleSaveRules = async (columnId: string, rules: CreateColumnRulesDto) => {
    try {
      await updateColumnRules.mutate({ id: columnId, rules })

      toast.success('Reglas actualizadas', {
        description: 'Las reglas de la columna se han actualizado correctamente',
      })

      // Invalidate the board query to refresh data
      queryClient.invalidateQueries({ queryKey: ['board'] })
    } catch (error) {
      console.error('Error al actualizar las reglas:', error)
      toast.error('Error al actualizar las reglas', {
        description: 'Ocurrió un error al actualizar las reglas de la columna',
      })
    }
  }

  const getPriorityValues = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return {
          textColor: 'text-green-500',
          bgColor: 'bg-green-100',
          text: 'Baja',
        }
      case 'MEDIUM':
        return {
          textColor: 'text-yellow-500',
          bgColor: 'bg-yellow-100',
          text: 'Media',
        }
      case 'HIGH':
        return {
          textColor: 'text-red-500',
          bgColor: 'bg-red-100',
          text: 'Alta',
        }
      default:
        return {
          textColor: 'text-muted-foreground',
          bgColor: 'bg-muted-foreground/10',
          text: 'Sin prioridad',
        }
    }
  }

  return (
    <>
      <KanbanProvider onDragEnd={handleDragEnd} className="p-4">
        {boardData.columns.map((column) => (
          <KanbanBoard key={column.name} id={column.name}>
            {column.id ? (
              <>
                <KanbanHeader
                  name={column.name}
                  color={column.color || '#000000'}
                  cardCount={column.cards.length}
                  onUpdateName={(newName) => handleUpdateColumnName(column.id, newName)}
                  onUpdateColor={(newColor) => handleUpdateColumnColor(column.id, newColor)}
                  onEditRules={() => handleEditRules(column.id)}
                />
                <KanbanCards>
                  {column.cards.map((card, index) => (
                    <KanbanCard
                      key={card.id}
                      id={card.id}
                      name={card.name}
                      parent={column.name}
                      index={index}
                      onClick={() => handleCardClick(card)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-col gap-1">
                          <p className="m-0 flex-1 font-medium text-sm">{card.name}</p>
                          <p className="m-0 text-muted-foreground text-xs">{card.description}</p>
                          <Badge
                            className={`m-0 text-xs ${getPriorityValues(card.priority || '').textColor} ${getPriorityValues(card.priority || '').bgColor} rounded-md px-2 py-1 font-bold w-fit my-2`}
                          >
                            {getPriorityValues(card.priority || '').text}
                          </Badge>
                          <div className="flex flex-wrap gap-2">
                            {card.labels?.slice(0, MAX_VISIBLE_LABELS).map((label) => (
                              <Badge key={label} variant="outline">
                                {label}
                              </Badge>
                            ))}
                            {card.labels && card.labels.length > MAX_VISIBLE_LABELS && (
                              <Badge variant="outline" className="cursor-default">
                                +{card.labels.length - MAX_VISIBLE_LABELS}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-start gap-1">
                        <p
                          className={`m-0 text-xs ${dateFormatter.isOverdue(new Date(card.dueDate)) ? 'text-red-500' : 'text-muted-foreground'}`}
                        >
                          {dateFormatter.format(new Date(card.dueDate))}
                        </p>
                      </div>
                    </KanbanCard>
                  ))}
                  <CreateCardForm
                    onSave={(cardData: { name: string; description: string; dueDate: Date }) =>
                      handleCreateCard(column.id, cardData)
                    }
                    isOpen={activeFormColumnId === column.id}
                    onOpenChange={(isOpen: boolean) => setActiveFormColumnId(isOpen ? column.id : null)}
                  />
                </KanbanCards>
              </>
            ) : (
              <CreateColumnDialog onSave={handleAddColumn} />
            )}
          </KanbanBoard>
        ))}
      </KanbanProvider>

      <TaskPanel cardId={selectedCardId || ''} isOpen={isTaskPanelOpen} onClose={handleCloseTaskPanel} />

      <ColumnRulesModal
        open={columnRulesModalState.open}
        onOpenChange={(open) => setColumnRulesModalState((prev) => ({ ...prev, open }))}
        columnId={columnRulesModalState.columnId}
        columnName={columnRulesModalState.columnName}
        initialRules={columnRulesModalState.rules}
        onSave={handleSaveRules}
      />
    </>
  )
}
