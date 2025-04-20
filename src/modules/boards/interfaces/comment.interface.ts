export interface BoardColumnCardComment {
  id: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface CreateBoardColumnCardCommentDto {
  content: string
  cardId: string
}
