import { useState, useRef, useEffect, useCallback } from 'react'
import { PaginationState } from '@tanstack/react-table'
import { useSearchParams } from 'react-router-dom'

interface UseTablePaginationProps {
  defaultPageSize?: number
}

export const useTablePagination = ({ defaultPageSize = 10 }: UseTablePaginationProps = {}) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const previousPageSize = useRef(defaultPageSize)

  const getValidPageIndex = (page: string | null): number => {
    if (!page) return 0
    const parsedPage = parseInt(page)
    return isNaN(parsedPage) || parsedPage < 1 ? 0 : parsedPage - 1
  }

  const getValidPageSize = (limit: string | null): number => {
    if (!limit) return defaultPageSize
    const parsedLimit = parseInt(limit)
    return isNaN(parsedLimit) || parsedLimit < 1 ? defaultPageSize : parsedLimit
  }

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: getValidPageIndex(searchParams.get('page')),
    pageSize: getValidPageSize(searchParams.get('limit')),
  })

  useEffect(() => {
    const currentPage = getValidPageIndex(searchParams.get('page'))
    const currentSize = getValidPageSize(searchParams.get('limit'))

    if (currentPage !== pagination.pageIndex || currentSize !== pagination.pageSize) {
      setPagination({
        pageIndex: currentPage,
        pageSize: currentSize,
      })
    }
  }, [searchParams])

  const updateUrl = useCallback(
    (newPagination: PaginationState) => {
      const newSearchParams = new URLSearchParams(searchParams)
      newSearchParams.set('page', String(newPagination.pageIndex + 1))
      newSearchParams.set('limit', String(newPagination.pageSize))
      setSearchParams(newSearchParams, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  const handlePaginationChange = useCallback(
    (updaterOrValue: PaginationState | ((old: PaginationState) => PaginationState)) => {
      const newPagination = typeof updaterOrValue === 'function' ? updaterOrValue(pagination) : updaterOrValue

      if (newPagination.pageSize !== previousPageSize.current) {
        const updatedPagination = {
          ...newPagination,
          pageIndex: 0,
        }
        setPagination(updatedPagination)
        updateUrl(updatedPagination)
      } else {
        setPagination(newPagination)
        updateUrl(newPagination)
      }

      previousPageSize.current = newPagination.pageSize
    },
    [pagination, updateUrl],
  )

  return {
    pagination,
    handlePaginationChange,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  }
}
