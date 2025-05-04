import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Search, Send, Pencil, Trash2, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  HistoryActionType,
  UpdateBoardColumnCardDto,
  type BoardColumnCard,
  type BoardColumnCardComment,
  type BoardColumnCardHistory,
  type CreateBoardColumnCardCommentDto,
} from '@/modules/boards/interfaces/board.interface'
import { useEffect, useState } from 'react'
import { DateFormatter } from '@/lib/date-formatters'
import { useCustomers } from '@/modules/customers/useCustomers'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCard } from '@/modules/boards/hooks/useCard'
import { ChangesFormatter, HistoryChanges } from '@/lib/changes-formatter'
import { useComment } from '@/modules/boards/hooks/useComment'
import { Badge } from '@/components/ui/badge'
const dateFormatter = DateFormatter.getInstance()
const changesFormatter = ChangesFormatter.getInstance()

interface TaskPanelProps {
  cardId: string
  isOpen: boolean
  onClose: () => void
}

export const TaskPanel = ({ cardId, isOpen, onClose }: TaskPanelProps) => {
  const { card, updateCard } = useCard(cardId)
  const { addComment, deleteComment } = useComment()

  const [editedCard, setEditedCard] = useState<BoardColumnCard | null>(null)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [newComment, setNewComment] = useState('')
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editedCommentContent, setEditedCommentContent] = useState('')
  const { customersData } = useCustomers({ search: searchQuery })
  const [newLabel, setNewLabel] = useState('')
  const MAX_VISIBLE_LABELS = 3

  useEffect(() => {
    setEditedCard(card || null)
    setIsEditingTitle(false)
    setDate(card?.dueDate ? new Date(card.dueDate) : undefined)
  }, [card])

  if (!isOpen || !card) return null

  const handleSave = () => {
    if (editedCard) {
      updateCard.mutate({ id: card.id, data: new UpdateBoardColumnCardDto(editedCard) })
    }
  }

  const handleInputChange = (field: keyof BoardColumnCard, value: string) => {
    if (!editedCard) return

    setEditedCard((prev) => ({
      ...prev!,
      [field]: value,
    }))
  }

  const handleCustomerChange = (customerId: string) => {
    const selectedCustomer = customersData.data.find((c) => c.id === customerId)
    if (selectedCustomer) {
      setEditedCard((prev) => ({
        ...prev!,
        customer: selectedCustomer,
      }))
    }
  }

  const handleCancel = () => {
    setIsEditingTitle(false)
    setEditedCard(card)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = e.currentTarget.value.trim()
      if (value) {
        handleInputChange('name', value)
        setIsEditingTitle(false)
      }
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const handleTitleBlur = () => {
    const value = editedCard?.name?.trim()
    if (value) {
      setIsEditingTitle(false)
    } else {
      setEditedCard((prev) => ({
        ...prev!,
        name: card.name,
      }))
      setIsEditingTitle(false)
    }
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment: CreateBoardColumnCardCommentDto = {
      content: newComment,
      cardId: card.id,
    }

    addComment.mutate(comment)
    setNewComment('')
  }

  const handleEditComment = (comment: BoardColumnCardComment) => {
    setEditingCommentId(comment.id)
    setEditedCommentContent(comment.content)
  }

  const handleSaveComment = (commentId: string) => {
    if (!editedCommentContent.trim()) return

    const updatedComments = editedCard?.comments?.map((comment) =>
      comment.id === commentId ? { ...comment, content: editedCommentContent } : comment,
    )

    setEditedCard((prev) => ({
      ...prev!,
      comments: updatedComments,
    }))

    setEditingCommentId(null)
    setEditedCommentContent('')
  }

  const handleDeleteComment = (commentId: string) => {
    deleteComment.mutate(commentId)
  }

  const filteredCustomers = customersData.data.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.documentId.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getActionMessage = (action: HistoryActionType) => {
    const actionMessages = {
      [HistoryActionType.COMMENT_ADDED]: {
        text: 'Agregaste un comentario',
        className: 'text-blue-600',
      },
      [HistoryActionType.MOVED]: {
        text: 'Se movió la tarjeta',
        className: 'text-amber-600',
      },
      [HistoryActionType.CUSTOMER_LINKED]: {
        text: 'Vinculaste un cliente',
        className: 'text-green-600',
      },
      [HistoryActionType.CUSTOMER_UNLINKED]: {
        text: 'Desvinculaste un cliente',
        className: 'text-red-600',
      },
      [HistoryActionType.DUE_DATE_CHANGED]: {
        text: 'Cambiaste la fecha de vencimiento',
        className: 'text-purple-600',
      },
      [HistoryActionType.UPDATED]: {
        text: 'Actualizaste la tarjeta',
        className: 'text-gray-700',
      },
      [HistoryActionType.COMMENT_DELETED]: {
        text: 'Eliminaste un comentario',
        className: 'text-red-600',
      },
      [HistoryActionType.PRIORITY_CHANGED]: {
        text: 'Cambiaste la prioridad',
        className: 'text-orange-600',
      },
    }

    const message = actionMessages[action as keyof typeof actionMessages] || actionMessages[HistoryActionType.UPDATED]
    return <span className={`text-sm font-medium block mb-1 ${message.className}`}>{message.text}</span>
  }

  const handlePriorityChange = (priority: string) => {
    setEditedCard((prev) => ({
      ...prev!,
      priority,
    }))
  }

  const handleAddLabel = () => {
    if (!newLabel.trim() || !editedCard) return

    const updatedLabels = [...(editedCard.labels || []), newLabel.trim()]

    setEditedCard((prev) => ({
      ...prev!,
      labels: updatedLabels,
    }))

    setNewLabel('')
  }

  const handleRemoveLabel = (labelToRemove: string) => {
    if (!editedCard) return

    const updatedLabels = editedCard.labels?.filter((label) => label !== labelToRemove) || []

    setEditedCard((prev) => ({
      ...prev!,
      labels: updatedLabels,
    }))
  }

  const handleLabelKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newLabel.trim()) {
      e.preventDefault()
      handleAddLabel()
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={handleCancel} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-screen w-[700px] bg-background border-l shadow-lg z-50 flex flex-col">
        {/* Header */}
        <div className="border-b p-6 flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0 border hover:border-amber-950 border-transparent">
              {isEditingTitle ? (
                <Input
                  value={editedCard?.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleTitleBlur}
                  className="!text-2xl font-semibold border-none focus-visible:!ring-0 shadow-none h-[42px] px-0 md:!text-2xl"
                  autoFocus
                />
              ) : (
                <h2
                  className="text-2xl font-semibold truncate cursor-pointer hover:text-primary/80 transition-colors py-1"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {editedCard?.name || card.name}
                </h2>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                Cancelar
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleSave}>
                Guardar
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Task Information */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-4">
                {/* Customer Selection */}
                <div className="grid grid-cols-3 gap-4 items-center">
                  <Label className="font-normal">Cliente</Label>
                  <Select value={editedCard?.customer?.id} onValueChange={handleCustomerChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="p-2">
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Buscar cliente..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8"
                          />
                        </div>
                      </div>
                      {filteredCustomers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} {customer.lastName} - {customer.documentId}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Due Date */}
                <div className="grid grid-cols-3 gap-4 items-center">
                  <Label className="font-normal">Fecha límite</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'h-8 justify-start text-left font-normal',
                          !date
                            ? 'text-muted-foreground'
                            : dateFormatter.isOverdue(date)
                              ? 'text-red-500'
                              : 'text-muted-foreground',
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? dateFormatter.format(date) : <span>Seleccionar fecha</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => {
                          setDate(newDate)
                          if (newDate) {
                            handleInputChange('dueDate', newDate.toISOString())
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Priority */}
                <div className="grid grid-cols-3 gap-4 items-center">
                  <Label className="font-normal">Prioridad</Label>
                  <Select value={editedCard?.priority} onValueChange={handlePriorityChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una prioridad" />
                    </SelectTrigger>
                    <SelectContent className="flex flex-col gap-2">
                      <SelectItem value="LOW" className="text-green-500">
                        Baja
                      </SelectItem>
                      <SelectItem value="MEDIUM" className="text-yellow-500">
                        Media
                      </SelectItem>
                      <SelectItem value="HIGH" className="text-red-500">
                        Alta
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Labels */}
                <div className="grid grid-cols-3 gap-4 items-center">
                  <Label className="font-normal">Etiquetas</Label>
                  <div className="col-span-2 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {editedCard?.labels?.slice(0, MAX_VISIBLE_LABELS).map((label) => (
                        <Badge key={label} variant="outline" className="flex items-center gap-1 py-1">
                          {label}
                          <button
                            onClick={() => handleRemoveLabel(label)}
                            className="ml-1 h-4 w-4 rounded-full hover:bg-muted flex items-center justify-center"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                      {editedCard?.labels && editedCard.labels.length > MAX_VISIBLE_LABELS && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Badge variant="outline" className="cursor-pointer">
                              +{editedCard.labels.length - MAX_VISIBLE_LABELS} más
                            </Badge>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-2" align="start">
                            <div className="flex flex-col gap-2">
                              {editedCard.labels.slice(MAX_VISIBLE_LABELS).map((label) => (
                                <div key={label} className="flex items-center justify-between gap-2">
                                  <span>{label}</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleRemoveLabel(label)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        onKeyDown={handleLabelKeyDown}
                        placeholder="Nueva etiqueta..."
                        className="h-8"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleAddLabel}
                        disabled={!newLabel.trim()}
                        className="h-8 px-2"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="font-normal">Descripción</Label>
              </div>
              <Textarea
                value={editedCard?.description || card.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="min-h-[100px]"
                placeholder="Add a description..."
              />
            </div>
          </div>
        </div>

        {/* Footer with Tabs */}
        <div className="sticky bottom-0 border-t bg-white">
          <Tabs defaultValue="comments" className="w-full">
            <div className="border-b">
              <TabsList className="w-full justify-start rounded-none border-b px-4">
                <TabsTrigger value="comments" className="relative">
                  Comentarios {card.comments?.length}
                </TabsTrigger>
                <TabsTrigger value="activity" className="relative">
                  Actividad {card.history?.length}
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="px-4 py-4 h-[200px] overflow-y-auto">
              <TabsContent value="activity" className="mt-0">
                <div className="space-y-4">
                  {card.history?.map((item: BoardColumnCardHistory) => (
                    <div key={item.id} className="flex items-start gap-4 p-2 rounded-lg">
                      <div className="flex-1">
                        {item.action && getActionMessage(item.action)}
                        {item.description && (
                          <span className="text-sm text-muted-foreground block italic mb-1">
                            {changesFormatter.formatChanges(item.changes as HistoryChanges)}
                          </span>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {dateFormatter.format(new Date(item.createdAt))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="comments" className="mt-0 flex flex-col">
                <div className="space-y-4 flex-1 overflow-y-auto mb-4">
                  {editedCard?.comments?.map((comment: BoardColumnCardComment) => (
                    <div key={comment.id} className="flex items-start gap-2">
                      <div className="flex-1">
                        {editingCommentId === comment.id ? (
                          <div className="space-y-2">
                            <Textarea
                              value={editedCommentContent}
                              onChange={(e) => setEditedCommentContent(e.target.value)}
                              className="min-h-[60px]"
                            />
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => setEditingCommentId(null)}>
                                Cancelar
                              </Button>
                              <Button size="sm" onClick={() => handleSaveComment(comment.id)}>
                                Guardar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm">{comment.content}</p>
                            <div className="flex items-center gap-2 justify-between">
                              <p className="text-xs text-muted-foreground">
                                {dateFormatter.format(new Date(comment.createdAt))}
                              </p>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleEditComment(comment)}
                                >
                                  <Pencil className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleDeleteComment(comment.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>
          <div className="sticky bottom-0 bg-white p-2">
            <div className="flex gap-2 items-center">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe un comentario..."
                className="min-h-[60px]"
              />

              <Button size="icon" variant="ghost" onClick={handleAddComment} disabled={!newComment.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
