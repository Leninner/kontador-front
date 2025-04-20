import {
  CreateDeclarationDto,
  Declaration,
  FindAllDeclarationsDto,
  UpdateDeclarationDto,
} from './declarations.interface'
import { httpClient } from '@/lib/http'

interface ApiResponseMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

interface ApiResponse<T> {
  success: boolean
  data: T
  meta?: ApiResponseMeta
  error?: {
    message: string
    code: string
  }
}

interface DeclarationsResponse {
  data: Declaration[]
  meta: ApiResponseMeta
}

const BASE_URL = '/declarations'

export const declarationsService = {
  async findAll(params: FindAllDeclarationsDto = {}): Promise<DeclarationsResponse> {
    const queryString = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryString.append(key, String(value))
      }
    })
    const url = `${BASE_URL}?${queryString.toString()}`
    const response = await httpClient.get<ApiResponse<Declaration[]>>(url)
    return {
      data: response.data.data,
      meta: response.data.meta || {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      },
    }
  },

  async findOne(id: string): Promise<Declaration> {
    const response = await httpClient.get<ApiResponse<Declaration>>(`${BASE_URL}/${id}`)
    return response.data.data
  },

  async create(data: CreateDeclarationDto): Promise<Declaration> {
    const response = await httpClient.post<ApiResponse<Declaration>>(BASE_URL, data)
    return response.data.data
  },

  async update(id: string, data: UpdateDeclarationDto): Promise<Declaration> {
    const response = await httpClient.patch<ApiResponse<Declaration>>(`${BASE_URL}/${id}`, data)
    return response.data.data
  },

  async remove(id: string): Promise<void> {
    await httpClient.delete(`${BASE_URL}/${id}`)
  },
}
