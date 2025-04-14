import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { customersService } from './customers.service'
import { CreateCustomerDto, UpdateCustomerDto, FindAllCustomersDto } from './customers.interface'

export const useCustomers = (query?: FindAllCustomersDto) => {
  const queryClient = useQueryClient()

  const customers = useQuery({
    queryKey: ['customers', query],
    queryFn: () => customersService.findAll(query),
  })

  const createCustomer = useMutation({
    mutationFn: (data: CreateCustomerDto) => customersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })

  const updateCustomer = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerDto }) => customersService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })

  const deleteCustomer = useMutation({
    mutationFn: (id: string) => customersService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })

  return {
    customersData: customers.data || { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } },
    isLoading: customers.isLoading,
    error: customers.error,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  }
}
