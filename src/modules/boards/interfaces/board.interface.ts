import { Customer } from '../../customers/customers.interface'

export enum HistoryActionType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  MOVED = 'MOVED',
  COMMENT_ADDED = 'COMMENT_ADDED',
  CUSTOMER_LINKED = 'CUSTOMER_LINKED',
  CUSTOMER_UNLINKED = 'CUSTOMER_UNLINKED',
  DUE_DATE_CHANGED = 'DUE_DATE_CHANGED',
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
  history?: BoardColumnCardHistory[]
  comments?: BoardColumnCardComment[]
  createdAt: string
  updatedAt: string
  description?: string
}

export interface BoardColumnCardHistory {
  id: string
  changes: Record<string, unknown>
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
  description?: string
  boardId: string
}

export type UpdateBoardColumnDto = Partial<CreateBoardColumnDto>
