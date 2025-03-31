import { httpClient } from '../../lib/http'

export interface CustomerDocument {
  id: string
  name: string
  type: string
  size: number
  url: string
  createdAt: string
}

export const documentsService = {
  async uploadDocuments(customerId: string, files: File[]) {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    const response = await httpClient.post<CustomerDocument[]>(`/customers/${customerId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async getDocuments(customerId: string) {
    const response = await httpClient.get<CustomerDocument[]>(`/customers/${customerId}/documents`)
    return response.data
  },

  async deleteDocument(customerId: string, documentId: string) {
    const response = await httpClient.delete<CustomerDocument>(`/customers/${customerId}/documents/${documentId}`)
    return response.data
  },
}
