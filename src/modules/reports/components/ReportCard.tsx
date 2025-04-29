import React, { ReactNode } from 'react'

type ReportCardProps = {
  title: string
  value: string | number
  icon?: ReactNode
  trend?: number
  description?: string
  loading?: boolean
}

export const ReportCard: React.FC<ReportCardProps> = ({ title, value, icon, trend, description, loading = false }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col h-full">
      {loading ? (
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
            {icon && <div className="text-blue-500">{icon}</div>}
          </div>
          <div className="mb-2">
            <div className="text-2xl font-bold">{value}</div>
            {trend !== undefined && (
              <div
                className={`text-sm font-medium flex items-center ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}
              >
                {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </div>
            )}
          </div>
          {description && <p className="text-gray-500 text-sm mt-auto">{description}</p>}
        </>
      )}
    </div>
  )
}
