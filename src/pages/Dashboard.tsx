import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { ReportCard } from '../modules/reports/components/ReportCard'
import { DetailReport } from '../modules/reports/components/DetailReport'
import { CustomerGrowthChart } from '../modules/reports/components/CustomerGrowthChart'
import { InvoiceBarChart } from '../modules/reports/components/InvoiceBarChart'
import { CompliancePieChart } from '../modules/reports/components/CompliancePieChart'
import { PeriodSelector } from '../modules/reports/components/PeriodSelector'
import {
  CustomerGrowthRateResponse,
  InvoiceStatisticsResponse,
  DeclarationComplianceResponse,
  ResponseTimeData,
  reportsService,
} from '../modules/reports'

// Utility function to format currency values with 2 decimal places
const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '0.00'
  return value.toFixed(2)
}

// Utility function to safely get numeric values
const safeNumber = (value: number | null | undefined, defaultValue = 0): number => {
  if (value === null || value === undefined || isNaN(value)) return defaultValue
  return value
}

export const Dashboard = () => {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [growthRate, setGrowthRate] = useState<CustomerGrowthRateResponse | null>(null)
  const [invoiceStats, setInvoiceStats] = useState<InvoiceStatisticsResponse | null>(null)
  const [complianceRate, setComplianceRate] = useState<DeclarationComplianceResponse | null>(null)
  const [responseTime, setResponseTime] = useState<ResponseTimeData | null>(null)

  // Estado para el período seleccionado
  const currentDate = new Date()
  const [selectedPeriod, setSelectedPeriod] = useState(
    `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`,
  )
  const [periodType, setPeriodType] = useState<'month' | 'quarter' | 'year'>('month')

  // Función para cargar los datos según el período seleccionado
  const fetchReportData = async () => {
    setLoading(true)
    try {
      const [growthData, invoiceData, complianceData, responseData] = await Promise.all([
        reportsService.getCustomerGrowthRate({ periodType, period: selectedPeriod }),
        reportsService.getInvoiceStatistics({ periodType, period: selectedPeriod }),
        reportsService.getDeclarationComplianceRate({ periodType, period: selectedPeriod }),
        reportsService.getAverageResponseTime(),
      ])

      setGrowthRate(growthData)
      setInvoiceStats(invoiceData)
      setComplianceRate(complianceData)
      setResponseTime(responseData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Cargar datos cuando cambia el período o tipo de período
  useEffect(() => {
    fetchReportData()
  }, [selectedPeriod, periodType])

  // Manejar cambios en el período
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period)
  }

  // Manejar cambios en el tipo de período (mensual, trimestral, anual)
  const handlePeriodTypeChange = (type: 'month' | 'quarter' | 'year') => {
    setPeriodType(type)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <header className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Panel de Reportes</h1>
              <p className="text-blue-100 mt-2">
                Bienvenido{user?.name ? `, ${user.name}` : ''} | Periodo actual: {selectedPeriod}
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-3 text-white">
              <div className="text-center">
                <div className="text-3xl font-bold">{safeNumber(growthRate?.growthRate).toFixed(2)}%</div>
                <div className="text-sm text-blue-200">Crecimiento</div>
              </div>
              <div className="h-10 border-r border-blue-300 opacity-50"></div>
              <div className="text-center">
                <div className="text-3xl font-bold">{safeNumber(invoiceStats?.totalInvoices)}</div>
                <div className="text-sm text-blue-200">Facturas</div>
              </div>
              <div className="h-10 border-r border-blue-300 opacity-50"></div>
              <div className="text-center">
                <div className="text-3xl font-bold">{safeNumber(complianceRate?.complianceRate).toFixed(2)}%</div>
                <div className="text-sm text-blue-200">Cumplimiento</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Selector de período */}
      <div className="mb-8">
        <PeriodSelector
          currentPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
          onPeriodTypeChange={handlePeriodTypeChange}
        />
      </div>

      {/* Sección de reportes */}
      <div>
        <h2 className="text-xl font-bold mb-6">Indicadores Clave</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ReportCard
            title="Tasa de Crecimiento"
            value={`${safeNumber(growthRate?.growthRate).toFixed(2)}%`}
            trend={safeNumber(growthRate?.growthRate)}
            description={
              growthRate?.currentPeriod
                ? `Período: ${growthRate.currentPeriod.start} a ${growthRate.currentPeriod.end}`
                : 'Sin datos'
            }
            loading={loading}
          />

          <ReportCard
            title="Facturas Emitidas"
            value={safeNumber(invoiceStats?.totalInvoices)}
            description={`Total: $${formatCurrency(invoiceStats?.totalAmount)}`}
            loading={loading}
          />

          <ReportCard
            title="Cumplimiento de Declaraciones"
            value={`${safeNumber(complianceRate?.complianceRate).toFixed(2)}%`}
            description={`${safeNumber(complianceRate?.submittedDeclarations)} de ${safeNumber(complianceRate?.totalCustomers)} clientes`}
            loading={loading}
          />

          <ReportCard
            title="Tiempo de Respuesta"
            value={`${safeNumber(responseTime?.averageResponseTimeInHours).toFixed(2)} h`}
            description={`En ${safeNumber(responseTime?.analyzedCards)} interacciones`}
            loading={loading}
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <CustomerGrowthChart data={growthRate} loading={loading} />
          <InvoiceBarChart data={invoiceStats} loading={loading} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CompliancePieChart data={complianceRate} loading={loading} />

          <DetailReport title="Detalle de Facturación" loading={loading}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Total Facturas</p>
                <p className="text-xl font-bold">{safeNumber(invoiceStats?.totalInvoices)}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Monto Promedio</p>
                <p className="text-xl font-bold">${formatCurrency(invoiceStats?.averageAmount)}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total IVA</p>
                <p className="text-xl font-bold">${formatCurrency(invoiceStats?.totalIva)}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Impuestos</p>
                <p className="text-xl font-bold">${formatCurrency(invoiceStats?.totalTax)}</p>
              </div>
            </div>
          </DetailReport>
        </div>
      </div>
    </div>
  )
}
