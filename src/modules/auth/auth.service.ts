import { httpClient } from '@/lib/http'
import { IAuthResponse, ILoginDto, IRegisterDto } from './auth.interface'

const BASE_URL = '/auth'

export const authService = {
  login: async (credentials: ILoginDto): Promise<IAuthResponse> => {
    const response = await httpClient.post<IAuthResponse>(`${BASE_URL}/login`, credentials)
    return response.data
  },

  register: async (credentials: IRegisterDto): Promise<IAuthResponse> => {
    const response = await httpClient.post<IAuthResponse>(`${BASE_URL}/register`, credentials)
    return response.data
  },

  logout: async (): Promise<{ success: boolean }> => {
    const response = await httpClient.post<{ success: boolean }>(`${BASE_URL}/logout`)
    return response.data
  },
}
