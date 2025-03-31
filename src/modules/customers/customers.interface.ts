export type Customer = {
  id: string
  name: string
  lastName: string
  email: string
  documentType: string
  documentNumber: string
}

export const customers: Customer[] = [
  {
    id: '728ed52f',
    name: 'Juan',
    lastName: 'Perez',
    email: 'juan.perez@example.com',
    documentType: 'DNI',
    documentNumber: '1234567890',
  },
]
