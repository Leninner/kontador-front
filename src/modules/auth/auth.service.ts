/* eslint-disable @typescript-eslint/no-unused-vars */
import { httpClient } from '@/lib/http'
import { IAuthResponse, IRegisterDto, IUser, IVerifyPhoneDto } from './auth.interface'
const BASE_URL = '/auth'

export const authService = {
  login: async ({ email, password }: { email: string; password: string }): Promise<IAuthResponse> => {
    const response = await httpClient.post<IAuthResponse>(`${BASE_URL}/login`, { email, password })
    return response.data
  },

  register: async (credentials: IRegisterDto): Promise<IAuthResponse> => {
    const response = await httpClient.post<IAuthResponse>(`${BASE_URL}/register`, credentials)
    return response.data
  },

  updateUser: async (user: IUser): Promise<IAuthResponse> => {
    const { id, phoneVerified, ...userWithoutId } = user

    const response = await httpClient.put<IAuthResponse>(`${BASE_URL}/user`, {
      ...userWithoutId,
      yearsOfExperience: Number(userWithoutId.yearsOfExperience),
    })
    return response.data
  },

  getUser: async (): Promise<IAuthResponse> => {
    const response = await httpClient.get<IAuthResponse>(`${BASE_URL}/user`)
    return response.data
  },

  verifyPhone: async (data: IVerifyPhoneDto): Promise<IAuthResponse> => {
    const response = await httpClient.post<IAuthResponse>(`${BASE_URL}/verify`, data)
    return response.data
  },
}
