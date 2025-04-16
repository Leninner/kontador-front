export interface Invoice {
  id: string
  customerId: string
  number: string
  date: string
  amount: number
  tax: number
  iva: number
  pdfUrl: string
  createdAt: string
  updatedAt: string
}

export interface CreateInvoiceDto {
  customerId: string
  number: string
  date: string
  amount: number
  tax: number
  iva: number
  pdfFile: File
}

export interface UpdateInvoiceDto {
  number?: string
  date?: string
  amount?: number
  tax?: number
  iva?: number
  pdfFile?: File
}
