export interface Customer {
  id: string
  name: string
  lastName: string
  email: string
  documentId: string
  documentType: string
  createdAt: string
  updatedAt: string
}

export interface CreateCustomerDto {
  name: string
  lastName: string
  email: string
  documentId: string
  documentType: string
}

export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {
  id: string
}

export interface FindAllCustomersDto extends Record<string, unknown> {
  search?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export const customers: Customer[] = [
  {
    id: '728ed52f',
    name: 'Juan',
    lastName: 'Perez',
    email: 'juan.perez@example.com',
    documentType: 'DNI',
    documentId: '1234567890',
    createdAt: '2024-04-01T12:00:00',
    updatedAt: '2024-04-01T12:00:00',
  },
]
