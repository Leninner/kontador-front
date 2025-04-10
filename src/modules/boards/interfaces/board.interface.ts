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
  description?: string
  createdAt: string
  updatedAt: string
}

export interface CreateBoardColumnDto {
  name: string
  description?: string
  boardId: string
}

export type UpdateBoardColumnDto = Partial<CreateBoardColumnDto>
