'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ColumnRules, Rule, CreateRuleDto, CreateColumnRulesDto } from '@/modules/boards/interfaces/board.interface'
import { PlusCircle, Trash2, Plus } from 'lucide-react'
import { Label } from '@/components/ui/label'

export type ColumnRulesModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  columnId: string
  columnName: string
  initialRules?: ColumnRules
  onSave: (columnId: string, rules: CreateColumnRulesDto) => void
}

export const ColumnRulesModal = ({
  open,
  onOpenChange,
  columnId,
  columnName,
  initialRules,
  onSave,
}: ColumnRulesModalProps) => {
  const defaultRules: ColumnRules = {
    enabled: false,
    rules: [],
  }

  const [columnRules, setColumnRules] = useState<ColumnRules>(initialRules || defaultRules)
  const [expandedRuleId, setExpandedRuleId] = useState<string>('')

  const prepareRulesForAPI = (rules: ColumnRules): CreateColumnRulesDto => {
    const apiReadyRules: CreateColumnRulesDto = {
      enabled: rules.enabled,
      rules: rules.rules.map((rule) => {
        if (rule.id.startsWith('temp-')) {
          return CreateRuleDto.convertRuleToCreateDto(rule, columnId)
        }

        return rule
      }),
    }

    return apiReadyRules
  }

  useEffect(() => {
    if (initialRules) {
      setColumnRules(initialRules)
    } else {
      setColumnRules(defaultRules)
    }
  }, [initialRules, open])

  const handleEnabledChange = (checked: boolean) => {
    setColumnRules((prev) => ({ ...prev, enabled: checked }))
  }

  const handleAddRule = () => {
    // Generate a temporary ID for new rules
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

    const newRule: Rule = {
      id: tempId,
      name: `Regla ${columnRules.rules.length + 1}`,
      enabled: true,
      trigger: { type: 'card_moved', config: {} },
      conditions: [{ type: 'has_customer', config: {} }],
      action: {
        type: 'send_email',
        config: {
          subject: 'Notificación',
          templateName: 'card-moved',
        },
      },
    }

    setColumnRules((prev) => ({
      ...prev,
      rules: [...prev.rules, newRule],
    }))

    // Auto-expand the new rule
    setExpandedRuleId(tempId)
  }

  const handleDeleteRule = (ruleId: string) => {
    setColumnRules((prev) => ({
      ...prev,
      rules: prev.rules.filter((rule) => rule.id !== ruleId),
    }))
  }

  const handleRuleNameChange = (ruleId: string, name: string) => {
    setColumnRules((prev) => ({
      ...prev,
      rules: prev.rules.map((rule) => (rule.id === ruleId ? { ...rule, name } : rule)),
    }))
  }

  const handleRuleEnabledChange = (ruleId: string, enabled: boolean) => {
    setColumnRules((prev) => ({
      ...prev,
      rules: prev.rules.map((rule) => (rule.id === ruleId ? { ...rule, enabled } : rule)),
    }))
  }

  const handleTriggerTypeChange = (ruleId: string, type: string) => {
    setColumnRules((prev) => ({
      ...prev,
      rules: prev.rules.map((rule) => (rule.id === ruleId ? { ...rule, trigger: { type, config: {} } } : rule)),
    }))
  }

  const handleAddCondition = (ruleId: string) => {
    setColumnRules((prev) => ({
      ...prev,
      rules: prev.rules.map((rule) =>
        rule.id === ruleId ? { ...rule, conditions: [...rule.conditions, { type: 'has_customer', config: {} }] } : rule,
      ),
    }))
  }

  const handleConditionTypeChange = (ruleId: string, index: number, type: string) => {
    setColumnRules((prev) => ({
      ...prev,
      rules: prev.rules.map((rule) => {
        if (rule.id === ruleId) {
          const newConditions = [...rule.conditions]
          newConditions[index] = { type, config: {} }
          return { ...rule, conditions: newConditions }
        }
        return rule
      }),
    }))
  }

  const handleRemoveCondition = (ruleId: string, index: number) => {
    setColumnRules((prev) => ({
      ...prev,
      rules: prev.rules.map((rule) => {
        if (rule.id === ruleId) {
          return {
            ...rule,
            conditions: rule.conditions.filter((_, i) => i !== index),
          }
        }
        return rule
      }),
    }))
  }

  const handleActionTypeChange = (ruleId: string, type: string) => {
    setColumnRules((prev) => ({
      ...prev,
      rules: prev.rules.map((rule) => {
        if (rule.id === ruleId) {
          const config = type === 'send_email' ? { subject: 'Notification', templateName: 'card-moved' } : {}
          return { ...rule, action: { type, config } }
        }
        return rule
      }),
    }))
  }

  const handleActionConfigChange = (ruleId: string, key: string, value: string) => {
    setColumnRules((prev) => ({
      ...prev,
      rules: prev.rules.map((rule) => {
        if (rule.id === ruleId) {
          return {
            ...rule,
            action: {
              ...rule.action,
              config: { ...rule.action.config, [key]: value },
            },
          }
        }
        return rule
      }),
    }))
  }

  const handleSave = () => {
    // Prepare rules for API by converting temporary IDs to CreateRuleDtos
    const apiReadyRules = prepareRulesForAPI(columnRules)
    onSave(columnId, apiReadyRules)
    onOpenChange(false)
  }

  // Generate user-friendly descriptions
  const getTriggerDescription = (type: string): string => {
    switch (type) {
      case 'card_created':
        return 'Cuando una tarjeta es creada'
      case 'card_moved':
        return 'Cuando una tarjeta es movida a esta columna'
      case 'due_date_approaching':
        return 'Cuando una fecha de vencimiento se acerca'
      default:
        return 'Desconocido'
    }
  }

  const getConditionDescription = (type: string): string => {
    switch (type) {
      case 'has_customer':
        return 'La tarjeta tiene un cliente'
      case 'has_due_date':
        return 'La tarjeta tiene una fecha de vencimiento'
      case 'has_label':
        return 'La tarjeta tiene una etiqueta específica'
      case 'custom_field_value':
        return 'El campo personalizado tiene un valor'
      default:
        return 'Desconocido'
    }
  }

  const getActionDescription = (type: string, config?: Record<string, unknown>): string => {
    switch (type) {
      case 'send_email':
        return `Enviar correo electrónico: ${config?.subject || 'Notificación'}`
      case 'move_to_column':
        return 'Mover a otra columna'
      case 'assign_due_date':
        return 'Asignar fecha de vencimiento'
      case 'add_label':
        return 'Agregar etiqueta'
      case 'notify_user':
        return 'Notificar usuario'
      default:
        return 'Desconocido'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reglas de la columna: {columnName}</DialogTitle>
        </DialogHeader>

        <div className="flex items-center space-x-2 py-4">
          <Checkbox id="rules-enabled" checked={columnRules.enabled} onCheckedChange={handleEnabledChange} />
          <Label htmlFor="rules-enabled">Habilitar reglas para esta columna</Label>
        </div>

        {columnRules.enabled && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Reglas</h3>
              <Button variant="outline" size="sm" onClick={handleAddRule}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Agregar regla
              </Button>
            </div>

            {columnRules.rules.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No hay reglas agregadas. Agrega una regla para definir la automatización para esta columna.
                </CardContent>
              </Card>
            ) : (
              <Accordion
                type="single"
                collapsible
                value={expandedRuleId}
                onValueChange={(value: string) => setExpandedRuleId(value)}
              >
                {columnRules.rules.map((rule) => (
                  <AccordionItem value={rule.id} key={rule.id}>
                    <Card className="mb-4">
                      <CardHeader className="p-4 pb-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={rule.enabled}
                              onCheckedChange={(checked) => handleRuleEnabledChange(rule.id, checked === true)}
                              id={`rule-enabled-${rule.id}`}
                            />
                            <AccordionTrigger className="p-0 hover:no-underline">
                              <div className="flex gap-2 items-center">
                                <h4 className="text-sm font-medium">{rule.name}</h4>
                              </div>
                            </AccordionTrigger>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteRule(rule.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardDescription className="ml-10 mt-1">
                          {rule.enabled ? 'Activa' : 'Inactiva'} - {getTriggerDescription(rule.trigger.type)}
                          {rule.conditions.length > 0
                            ? ` cuando ${getConditionDescription(rule.conditions[0].type)}`
                            : ''}
                          {rule.conditions.length > 1 ? ` y ${rule.conditions.length - 1} más condiciones` : ''}
                          {` entonces ${getActionDescription(rule.action.type, rule.action.config)}`}
                        </CardDescription>
                      </CardHeader>

                      <AccordionContent>
                        <CardContent className="p-4 pt-0">
                          <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                              <Label>Nombre de la regla</Label>
                              <Input
                                value={rule.name}
                                onChange={(e) => handleRuleNameChange(rule.id, e.target.value)}
                                placeholder="Enter rule name"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Cuando esto sucede (Trigger)</Label>
                              <Select
                                value={rule.trigger.type}
                                onValueChange={(value) => handleTriggerTypeChange(rule.id, value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select trigger type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="card_created">Tarjeta creada</SelectItem>
                                  <SelectItem value="card_moved">Tarjeta movida a esta columna</SelectItem>
                                  <SelectItem value="due_date_approaching">Fecha de vencimiento cercana</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <Label>Y estas condiciones se cumplen</Label>
                                <Button variant="ghost" size="sm" onClick={() => handleAddCondition(rule.id)}>
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              {rule.conditions.length === 0 ? (
                                <div className="p-4 border rounded-md text-center text-muted-foreground text-sm">
                                  No hay condiciones agregadas (siempre se ejecutará)
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {rule.conditions.map((condition, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <Select
                                        value={condition.type}
                                        onValueChange={(value) => handleConditionTypeChange(rule.id, index, value)}
                                      >
                                        <SelectTrigger className="flex-1">
                                          <SelectValue placeholder="Select condition type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="has_customer">Tiene cliente</SelectItem>
                                          <SelectItem value="has_due_date">Tiene fecha de vencimiento</SelectItem>
                                          <SelectItem value="has_label">Tiene etiqueta</SelectItem>
                                          <SelectItem value="custom_field_value">
                                            Valor de campo personalizado
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveCondition(rule.id, index)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label>Entonces haz esto (Acción)</Label>
                              <Select
                                value={rule.action.type}
                                onValueChange={(value) => handleActionTypeChange(rule.id, value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select action type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="send_email">Enviar correo electrónico</SelectItem>
                                  <SelectItem value="move_to_column">Mover a columna</SelectItem>
                                  <SelectItem value="assign_due_date">Asignar fecha de vencimiento</SelectItem>
                                  <SelectItem value="add_label">Agregar etiqueta</SelectItem>
                                  <SelectItem value="notify_user">Notificar usuario</SelectItem>
                                </SelectContent>
                              </Select>

                              {rule.action.type === 'send_email' && (
                                <div className="space-y-4 pl-4 border-l-2 border-gray-200 mt-4">
                                  <div className="space-y-2">
                                    <Label>Asunto</Label>
                                    <Input
                                      value={rule.action.config?.subject || ''}
                                      onChange={(e) => handleActionConfigChange(rule.id, 'subject', e.target.value)}
                                      placeholder="Asunto del correo electrónico"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Plantilla</Label>
                                    <Select
                                      value={rule.action.config?.templateName || 'card-moved'}
                                      onValueChange={(value) =>
                                        handleActionConfigChange(rule.id, 'templateName', value)
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select template" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="card-moved">Tarjeta movida</SelectItem>
                                        <SelectItem value="due-date-approaching">
                                          Fecha de vencimiento cercana
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Mensaje personalizado (opcional)</Label>
                                    <textarea
                                      className="w-full min-h-[100px] p-2 border rounded-md"
                                      value={rule.action.config?.customMessage || ''}
                                      onChange={(e) =>
                                        handleActionConfigChange(rule.id, 'customMessage', e.target.value)
                                      }
                                      placeholder="<p>Mensaje HTML personalizado</p>"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                      HTML soportado. Puedes usar variables como {'{{'} customer.name {'}}'}, {'{{'}{' '}
                                      card.name {'}}'}, etc.
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </AccordionContent>
                    </Card>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" onClick={handleSave}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
