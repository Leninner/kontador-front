import { httpClient } from '../../lib/http'

export const customersService = {
  getCustomersByAccountant: async (accountantId: string) => {
    const response = await httpClient.get(`/customers?accountantId=${accountantId}`)

    console.log(response)
    return response.data
  },
}
