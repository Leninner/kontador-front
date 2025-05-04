/* eslint-disable @typescript-eslint/no-explicit-any */
import { Customer } from '../../customers/customers.interface'

export enum HistoryActionType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  MOVED = 'MOVED',
  COMMENT_ADDED = 'COMMENT_ADDED',
  CUSTOMER_LINKED = 'CUSTOMER_LINKED',
  CUSTOMER_UNLINKED = 'CUSTOMER_UNLINKED',
  DUE_DATE_CHANGED = 'DUE_DATE_CHANGED',
  COMMENT_DELETED = 'COMMENT_DELETED',
  PRIORITY_CHANGED = 'PRIORITY_CHANGED',
}

export interface Board {
  id: string
  name: string
  description: string
  columns: BoardColumn[]
  createdAt: string
  updatedAt: string
}

export interface BoardColumn {
  id: string
  name: string
  cards: BoardColumnCard[]
  order: number
  createdAt: string
  updatedAt: string
  rules?: ColumnRules
  description?: string
  color?: string
}

export interface BoardColumnCard {
  id: string
  name: string
  customer: Partial<Customer>
  dueDate: string
  createdAt: string
  updatedAt: string
  priority?: string
  labels?: string[]
  description?: string
  history?: BoardColumnCardHistory[]
  comments?: BoardColumnCardComment[]
}

export class UpdateBoardColumnCardDto {
  name?: string
  customerId?: string
  dueDate?: string
  description?: string
  columnId?: string
  priority?: string
  labels?: string[]

  constructor(card: BoardColumnCard) {
    this.name = card.name
    this.customerId = card.customer?.id
    this.dueDate = card.dueDate
    this.description = card.description
    this.priority = card.priority
    this.labels = card.labels
  }
}

export interface BoardColumnCardHistory {
  id: string
  changes: Record<string, any>
  action: HistoryActionType
  createdAt: string
  updatedAt: string
  description?: string
}

export interface BoardColumnCardComment {
  id: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface CreateBoardColumnDto {
  name: string
  boardId: string
  description?: string
  color?: string
}

export interface CreateBoardColumnCardCommentDto {
  content: string
  cardId: string
}

export interface UpdateBoardColumnDto extends Partial<CreateBoardColumnDto> {
  rules?: Partial<CreateColumnRulesDto>
}

export class CreateRuleDto {
  id: string = ''
  name: string
  enabled: boolean
  trigger: {
    type: string
    config?: Record<string, any>
  }
  conditions: Array<{
    type: string
    config?: Record<string, any>
  }>
  action: {
    type: string
    config?: Record<string, any>
  }

  constructor(rule: Rule) {
    this.name = rule.name
    this.enabled = rule.enabled
    this.trigger = rule.trigger
    this.conditions = rule.conditions
    this.action = rule.action
  }

  static convertRuleToCreateDto(rule: Rule, columnId: string): CreateRuleDto {
    return {
      id: this.generateRandomRuleId(columnId),
      name: rule.name,
      enabled: rule.enabled,
      trigger: rule.trigger,
      conditions: rule.conditions,
      action: rule.action,
    }
  }

  static generateRandomRuleId(columnId: string): string {
    return `rule-${Math.random().toString(36).substring(2, 15)}-${columnId.toString().slice(0, 8)}`
  }
}

export interface Rule {
  id: string
  name: string
  enabled: boolean
  trigger: {
    type: string
    config?: Record<string, any>
  }
  conditions: Array<{
    type: string
    config?: Record<string, any>
  }>
  action: {
    type: string
    config?: Record<string, any>
  }
}

export interface ColumnRules {
  enabled: boolean
  rules: Rule[]
}

export interface BoardColumnWithRules extends BoardColumn {
  rules?: ColumnRules
}

export interface CreateColumnRulesDto {
  enabled: boolean
  rules: CreateRuleDto[]
}

export interface UpdateColumnRulesDto {
  rules: Partial<CreateRuleDto>[]
}

export * from './card.interface'
export * from './comment.interface'
export * from './rule.interface'
