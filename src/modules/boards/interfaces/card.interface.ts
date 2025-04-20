/* eslint-disable @typescript-eslint/no-explicit-any */
import { Customer } from '../../customers/customers.interface'
import { BoardColumnCardComment } from './comment.interface'
import { HistoryActionType } from './history.interface'

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
