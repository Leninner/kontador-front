import { httpClient } from '@/lib/http'
import { Invoice, CreateInvoiceDto, UpdateInvoiceDto } from './invoices.interface'

export interface FindAllInvoicesDto {
  customerId: string
  page?: number
  limit?: number
}

export const invoicesService = {
  findAll: async (query?: FindAllInvoicesDto) => {
    const response = await httpClient.get<{
      data: Invoice[]
      meta: { total: number; page: number; limit: number; totalPages: number }
    }>('/invoices', { params: { ...query, customerId: query?.customerId || '' } })
    return response.data
  },

  create: async (data: CreateInvoiceDto) => {
    const formData = new FormData()
    formData.append('customerId', data.customerId)
    formData.append('number', data.number)
    formData.append('date', data.date)
    formData.append('amount', data.amount.toString())

    const response = await httpClient.post<Invoice>('/invoices', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  update: async (id: string, data: UpdateInvoiceDto) => {
    const formData = new FormData()
    if (data.number) formData.append('number', data.number)
    if (data.date) formData.append('date', data.date)
    if (data.amount) formData.append('amount', data.amount.toString())

    const response = await httpClient.patch<Invoice>(`/invoices/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  remove: async (id: string) => {
    await httpClient.delete(`/invoices/${id}`)
  },
}
