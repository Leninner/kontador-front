import React, { useState } from 'react'

type PeriodType = 'month' | 'quarter' | 'year'

type PeriodSelectorProps = {
  currentPeriod: string
  onPeriodChange: (period: string) => void
  onPeriodTypeChange: (periodType: PeriodType) => void
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  currentPeriod,
  onPeriodChange,
  onPeriodTypeChange,
}) => {
  const [periodType, setPeriodType] = useState<PeriodType>('month')

  // Extraer año y mes del período actual (formato: YYYY-MM)
  const [year, month] = currentPeriod.split('-').map(Number)

  // Generar lista de años para seleccionar
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

  // Generar lista de meses
  const months = [
    { value: '01', label: 'Enero' },
    { value: '02', label: 'Febrero' },
    { value: '03', label: 'Marzo' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Mayo' },
    { value: '06', label: 'Junio' },
    { value: '07', label: 'Julio' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' },
  ]

  // Generar lista de trimestres
  const quarters = [
    { value: '01', label: 'Q1 (Ene-Mar)' },
    { value: '04', label: 'Q2 (Abr-Jun)' },
    { value: '07', label: 'Q3 (Jul-Sep)' },
    { value: '10', label: 'Q4 (Oct-Dic)' },
  ]

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = e.target.value
    let newMonth = String(month).padStart(2, '0')

    if (periodType === 'quarter') {
      // Buscar el trimestre más cercano
      const quarterMonth =
        quarters.find((q) => parseInt(q.value) <= month && month < parseInt(q.value) + 3)?.value || '01'
      newMonth = quarterMonth
    }

    onPeriodChange(`${newYear}-${newMonth}`)
  }

  const handleMonthOrQuarterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = e.target.value
    onPeriodChange(`${year}-${newMonth}`)
  }

  const handlePeriodTypeChange = (type: PeriodType) => {
    setPeriodType(type)
    onPeriodTypeChange(type)

    // Ajustar el mes según el tipo de período
    if (type === 'quarter') {
      // Encontrar el trimestre que contiene el mes actual
      const quarterMonth =
        quarters.find((q) => parseInt(q.value) <= month && month < parseInt(q.value) + 3)?.value || '01'
      onPeriodChange(`${year}-${quarterMonth}`)
    } else if (type === 'year') {
      onPeriodChange(`${year}-01`) // Usar enero como mes predeterminado para el año
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-3 items-center p-4 bg-white rounded-lg shadow">
      <div className="font-medium">Seleccionar período:</div>

      <div className="flex space-x-2">
        <button
          className={`px-3 py-1 rounded text-sm ${
            periodType === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => handlePeriodTypeChange('month')}
        >
          Mensual
        </button>
        <button
          className={`px-3 py-1 rounded text-sm ${
            periodType === 'quarter' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => handlePeriodTypeChange('quarter')}
        >
          Trimestral
        </button>
        <button
          className={`px-3 py-1 rounded text-sm ${
            periodType === 'year' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => handlePeriodTypeChange('year')}
        >
          Anual
        </button>
      </div>

      <div className="flex gap-2">
        <select className="border rounded px-3 py-1 text-sm" value={year} onChange={handleYearChange}>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {periodType !== 'year' && (
          <select
            className="border rounded px-3 py-1 text-sm"
            value={String(month).padStart(2, '0')}
            onChange={handleMonthOrQuarterChange}
          >
            {periodType === 'month'
              ? months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))
              : quarters.map((q) => (
                  <option key={q.value} value={q.value}>
                    {q.label}
                  </option>
                ))}
          </select>
        )}
      </div>
    </div>
  )
}
