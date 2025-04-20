import { httpClient } from '@/lib/http'
import { BoardColumnCardComment, CreateBoardColumnCardCommentDto } from '../interfaces/comment.interface'

const BASE_URL = '/boards'

export const commentService = {
  async addComment(data: CreateBoardColumnCardCommentDto) {
    const response = await httpClient.post<{ data: BoardColumnCardComment }>(`${BASE_URL}/comments`, data)
    return response.data.data
  },

  async deleteComment(commentId: string) {
    const response = await httpClient.delete<{ data: BoardColumnCardComment }>(`${BASE_URL}/comments/${commentId}`)
    return response.data.data
  },
}
