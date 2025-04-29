import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { CustomerGrowthRateResponse } from '../reports.interface'

type CustomerGrowthChartProps = {
  data: CustomerGrowthRateResponse | null
  loading: boolean
}

export const CustomerGrowthChart: React.FC<CustomerGrowthChartProps> = ({ data, loading }) => {
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
      name: 'Período Anterior',
      value: data.previousPeriod.customers,
      period: `${data.previousPeriod.start} - ${data.previousPeriod.end}`,
    },
    {
      name: 'Período Actual',
      value: data.currentPeriod.customers,
      period: `${data.currentPeriod.start} - ${data.currentPeriod.end}`,
    },
  ]

  return (
    <div className="h-80 bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Tendencia de Crecimiento de Clientes</h2>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart
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
          <Tooltip
            formatter={(value, name, props) => [`${value} clientes`, 'Cantidad']}
            labelFormatter={(label) => `${label}`}
          />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} name="Clientes" />
        </LineChart>
      </ResponsiveContainer>
      <div className="text-center text-sm text-gray-500 mt-2">
        Tasa de crecimiento:{' '}
        <span className={data.growthRate >= 0 ? 'text-green-500' : 'text-red-500'}>
          {data.growthRate >= 0 ? '+' : ''}
          {data.growthRate}%
        </span>
      </div>
    </div>
  )
}
