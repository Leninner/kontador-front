import { httpClient } from '@/lib/http'
import {
  NewCustomersResponse,
  CustomerGrowthRateResponse,
  InvoiceStatisticsResponse,
  DeclarationComplianceResponse,
  ResponseTimeData,
  ReportQueryParams,
} from './reports.interface'

const BASE_URL = '/reports'

export const reportsService = {
  async getNewCustomers(params?: Pick<ReportQueryParams, 'fromDate'>) {
    const response = await httpClient.get<{ data: NewCustomersResponse }>(`${BASE_URL}/new-customers`, { params })
    return response.data.data
  },

  async getCustomerGrowthRate(params?: Pick<ReportQueryParams, 'periodType'>) {
    const response = await httpClient.get<{ data: CustomerGrowthRateResponse }>(`${BASE_URL}/growth-rate`, { params })
    return response.data.data
  },

  async getInvoiceStatistics(params?: Pick<ReportQueryParams, 'period'>) {
    const response = await httpClient.get<{ data: InvoiceStatisticsResponse }>(`${BASE_URL}/invoice-statistics`, {
      params,
    })
    return response.data.data
  },

  async getDeclarationComplianceRate(params?: Pick<ReportQueryParams, 'period'>) {
    const response = await httpClient.get<{ data: DeclarationComplianceResponse }>(`${BASE_URL}/compliance-rate`, {
      params,
    })
    return response.data.data
  },

  async getAverageResponseTime(params?: Pick<ReportQueryParams, 'lastDays'>) {
    const response = await httpClient.get<{ data: ResponseTimeData }>(`${BASE_URL}/response-time`, { params })
    return response.data.data
  },
}
