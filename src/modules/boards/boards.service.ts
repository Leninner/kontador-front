import { httpClient } from '@/lib/http'
import {
  Board,
  BoardColumn,
  CreateBoardColumnDto,
  UpdateBoardColumnDto,
  BoardColumnCard,
  BoardColumnCardComment,
  CreateBoardColumnCardCommentDto,
  UpdateBoardColumnCardDto,
} from './interfaces/board.interface'

const BASE_URL = '/boards'

export const boardsService = {
  async findMyBoard() {
    const response = await httpClient.get<{ data: Board }>(`${BASE_URL}/my-board`)
    return response.data.data
  },

  async createColumn(data: CreateBoardColumnDto) {
    const response = await httpClient.post<{ data: BoardColumn }>(`${BASE_URL}/columns`, data)
    return response.data
  },

  async updateColumn(columnId: string, data: Partial<UpdateBoardColumnDto>) {
    const response = await httpClient.put<{ data: BoardColumn }>(`${BASE_URL}/columns/${columnId}`, data)
    return response.data.data
  },

  async deleteColumn(boardId: string, columnId: string) {
    const response = await httpClient.delete<{ data: BoardColumn }>(`${BASE_URL}/${boardId}/columns/${columnId}`)
    return response.data.data
  },

  async getCardDetails(cardId: string) {
    const response = await httpClient.get<{ data: BoardColumnCard }>(`${BASE_URL}/cards/${cardId}`)
    return response.data.data
  },

  async createCard(data: { name: string; description: string; dueDate: Date; columnId: string }) {
    const response = await httpClient.post<{ data: BoardColumnCard }>(`${BASE_URL}/cards`, data)
    return response.data.data
  },

  async updateCard(cardId: string, data: UpdateBoardColumnCardDto) {
    const response = await httpClient.put<{ data: BoardColumnCard }>(`${BASE_URL}/cards/${cardId}`, data)
    return response.data.data
  },

  async addComment(data: CreateBoardColumnCardCommentDto) {
    const response = await httpClient.post<{ data: BoardColumnCardComment }>(`${BASE_URL}/comments`, data)
    return response.data.data
  },

  async deleteComment(commentId: string) {
    const response = await httpClient.delete<{ data: BoardColumnCardComment }>(`${BASE_URL}/comments/${commentId}`)
    return response.data.data
  },

  async linkCustomer(cardId: string, customerId: string) {
    const response = await httpClient.post<{ data: BoardColumnCard }>(`${BASE_URL}/cards/${cardId}/customer`, {
      customerId,
    })
    return response.data.data
  },

  async unlinkCustomer(cardId: string) {
    const response = await httpClient.delete<{ data: BoardColumnCard }>(`${BASE_URL}/cards/${cardId}/customer`)
    return response.data.data
  },
}
