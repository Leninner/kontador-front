import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { invoicesService, FindAllInvoicesDto } from './invoices.service'
import { CreateInvoiceDto, UpdateInvoiceDto } from './invoices.interface'

export const useInvoices = (customerId: string, query?: Omit<FindAllInvoicesDto, 'customerId'>) => {
  const queryClient = useQueryClient()

  const invoices = useQuery({
    queryKey: ['invoices', customerId, query],
    queryFn: () => invoicesService.findAll({ customerId, ...query }),
  })

  const createInvoice = useMutation({
    mutationFn: (data: CreateInvoiceDto) => invoicesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices', customerId] })
    },
  })

  const updateInvoice = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInvoiceDto }) => invoicesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices', customerId] })
    },
  })

  const deleteInvoice = useMutation({
    mutationFn: (id: string) => invoicesService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices', customerId] })
    },
  })

  return {
    invoicesData: invoices.data || { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } },
    isLoading: invoices.isLoading,
    error: invoices.error,
    createInvoice,
    updateInvoice,
    deleteInvoice,
  }
}
