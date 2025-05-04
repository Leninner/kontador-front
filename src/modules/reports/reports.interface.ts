export interface Customer {
  id: string
  name: string
  lastName: string
  email: string
  documentType: string
  documentId: string
  createdAt: string
  updatedAt: string
}

export interface NewCustomersResponse {
  totalNewCustomers: number
  customers: Customer[]
}

export interface PeriodData {
  start: string
  end: string
  customers: number
}

export interface CustomerGrowthRateResponse {
  currentPeriod: PeriodData
  previousPeriod: PeriodData
  growthRate: number
}

export interface InvoiceStatisticsResponse {
  period: string
  periodType: 'month' | 'quarter' | 'year'
  periodRange: {
    start: string
    end: string
  }
  totalInvoices: number
  totalAmount: number
  averageAmount: number
  totalTax: number
  totalIva: number
}

export interface DeclarationComplianceResponse {
  period: string
  periodType: 'month' | 'quarter' | 'year'
  totalCustomers: number
  submittedDeclarations: number
  complianceRate: number
}

export interface ResponseTimeData {
  averageResponseTime: number
  averageResponseTimeInHours: number
  totalCards: number
  analyzedCards: number
}

export interface ReportQueryParams {
  fromDate?: string
  periodType?: 'month' | 'quarter' | 'year'
  period?: string
  lastDays?: number
}
