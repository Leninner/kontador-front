import { httpClient } from '@/lib/http'
import { Customer, CreateCustomerDto, UpdateCustomerDto, FindAllCustomersDto, Meta } from './customers.interface'

const BASE_URL = '/customers'

export const customersService = {
  async findAll(query?: FindAllCustomersDto) {
    const response = await httpClient.get<{ data: Customer[]; meta: Meta }>(BASE_URL, { params: query })
    return response.data
  },

  async findOne(id: string) {
    const response = await httpClient.get<{ data: Customer }>(`${BASE_URL}/${id}`)
    return response.data
  },

  async create(data: CreateCustomerDto) {
    const response = await httpClient.post<{ data: Customer }>(BASE_URL, data)
    return response.data
  },

  async update(id: string, data: UpdateCustomerDto) {
    const response = await httpClient.patch<{ data: Customer }>(`${BASE_URL}/${id}`, data)
    return response.data
  },

  async remove(id: string) {
    const response = await httpClient.delete<{ data: Customer }>(`${BASE_URL}/${id}`)
    return response.data
  },
}
