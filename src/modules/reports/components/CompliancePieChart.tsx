import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { DeclarationComplianceResponse } from '../reports.interface'

type CompliancePieChartProps = {
  data: DeclarationComplianceResponse | null
  loading: boolean
}

const COLORS = ['#0088FE', '#FFBB28']

export const CompliancePieChart: React.FC<CompliancePieChartProps> = ({ data, loading }) => {
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

  // Calcular datos para el gráfico circular
  const pendientes = data.totalCustomers - data.submittedDeclarations
  const chartData = [
    { name: 'Presentadas', value: data.submittedDeclarations },
    { name: 'Pendientes', value: pendientes },
  ]

  // Si no hay declaraciones, mostrar un mensaje
  if (data.totalCustomers === 0) {
    return (
      <div className="h-80 bg-white rounded-lg shadow p-6 flex flex-col justify-center items-center">
        <h2 className="text-lg font-semibold mb-4">Cumplimiento de Declaraciones</h2>
        <p className="text-gray-500">No hay datos disponibles para el período {data.period}</p>
      </div>
    )
  }

  return (
    <div className="h-80 bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Cumplimiento de Declaraciones ({data.period})</h2>
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} clientes`, '']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center text-sm text-gray-500 mt-2">
        Tasa de cumplimiento: <span className="font-semibold">{data.complianceRate}%</span>
      </div>
    </div>
  )
}
