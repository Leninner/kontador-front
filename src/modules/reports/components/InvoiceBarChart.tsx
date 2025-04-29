import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { InvoiceStatisticsResponse } from '../reports.interface'

type InvoiceBarChartProps = {
  data: InvoiceStatisticsResponse | null
  loading: boolean
}

export const InvoiceBarChart: React.FC<InvoiceBarChartProps> = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <div className="h-80 bg-white rounded-lg shadow p-6 flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full">
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-64 bg-gray-100 rounded w-full"></div>
        </div>
      </div>
    )
  }

  // Formatear los datos para el gráfico
  const chartData = [
    {
      name: 'Monto Total',
      value: data.totalAmount,
    },
    {
      name: 'IVA',
      value: data.totalIva,
    },
    {
      name: 'Impuestos',
      value: data.totalTax,
    },
  ]

  return (
    <div className="h-80 bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Resumen de Facturación ({data.period})</h2>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Valor']} />
          <Legend />
          <Bar dataKey="value" fill="#82ca9d" name="Valor ($)" />
        </BarChart>
      </ResponsiveContainer>
      <div className="text-center text-sm text-gray-500 mt-2">
        Total de facturas: <span className="font-semibold">{data.totalInvoices}</span>
      </div>
    </div>
  )
}
