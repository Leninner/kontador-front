import { httpClient } from '@/lib/http'
import { BoardColumnCard, UpdateBoardColumnCardDto } from '../interfaces/card.interface'

const BASE_URL = '/boards'

export const cardService = {
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
