import { httpClient } from '@/lib/http'
import { Board, BoardColumn, CreateBoardColumnDto, UpdateBoardColumnDto } from './interfaces/board.interface'

const BASE_URL = '/boards'

export const boardsService = {
  async findMyBoard() {
    const response = await httpClient.get<{ data: Board }>(`${BASE_URL}/my-board`)
    return response.data.data
  },

  async createColumn(boardId: string, data: CreateBoardColumnDto) {
    const response = await httpClient.post<{ data: BoardColumn }>(`${BASE_URL}/${boardId}/columns`, data)
    return response.data
  },

  async updateColumn(boardId: string, columnId: string, data: UpdateBoardColumnDto) {
    const response = await httpClient.patch<{ data: BoardColumn }>(`${BASE_URL}/${boardId}/columns/${columnId}`, data)
    return response.data
  },

  async deleteColumn(boardId: string, columnId: string) {
    const response = await httpClient.delete<{ data: BoardColumn }>(`${BASE_URL}/${boardId}/columns/${columnId}`)
    return response.data
  },
}
