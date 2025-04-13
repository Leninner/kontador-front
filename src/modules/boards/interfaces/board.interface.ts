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
  description?: string
  color?: string
  cards: BoardColumnCard[]
  order: number
  createdAt: string
  updatedAt: string
}

export interface BoardColumnCard {
  id: string
  name: string
  customer: Partial<Customer>
  dueDate: string
  createdAt: string
  updatedAt: string
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

  constructor(card: BoardColumnCard) {
    this.name = card.name
    this.customerId = card.customer?.id
    this.dueDate = card.dueDate
    this.description = card.description
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

export type UpdateBoardColumnDto = Partial<CreateBoardColumnDto>
