import React, { ReactNode } from 'react'

type DetailReportProps = {
  title: string
  loading: boolean
  children: ReactNode
}

export const DetailReport: React.FC<DetailReportProps> = ({ title, loading, children }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      ) : (
        children
      )}
    </div>
  )
}
