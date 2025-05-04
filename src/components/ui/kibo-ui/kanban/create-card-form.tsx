import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon, Plus, Search } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCustomers } from '@/modules/customers/useCustomers'

interface CreateCardFormProps {
  onSave: (data: { name: string; description: string; dueDate: Date; customerId?: string }) => void
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

export const CreateCardForm = ({ onSave, isOpen = false, onOpenChange }: CreateCardFormProps) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState<Date>()
  const [customerId, setCustomerId] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')

  const { customersData } = useCustomers({ search: searchQuery })

  const filteredCustomers = customersData.data

  useEffect(() => {
    if (!isOpen) {
      setName('')
      setDescription('')
      setDueDate(undefined)
      setCustomerId('')
      setSearchQuery('')
    }
  }, [isOpen])

  const handleSave = () => {
    if (!name.trim() || !dueDate) return

    onSave({
      name: name.trim(),
      description: description.trim(),
      dueDate,
      customerId: customerId || undefined,
    })

    onOpenChange?.(false)
  }

  const handleCancel = () => {
    setName('')
    setDescription('')
    setDueDate(undefined)
    setCustomerId('')
    setSearchQuery('')
    onOpenChange?.(false)
  }

  if (!isOpen) {
    return (
      <Button variant="outline" className="w-full" onClick={() => onOpenChange?.(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Nueva tarjeta
      </Button>
    )
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-4">
        <form className="space-y-4">
          <Input
            placeholder="Nombre de la tarea"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />

          <Textarea
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full min-h-[80px]"
          />

          <Select value={customerId} onValueChange={setCustomerId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar cliente" />
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

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn('w-full justify-start text-left font-normal', !dueDate && 'text-muted-foreground')}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, 'PPP') : <span>Seleccionar fecha de vencimiento</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
            </PopoverContent>
          </Popover>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!name.trim() || !dueDate}>
              Agregar tarjeta
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
