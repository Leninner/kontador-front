import { httpClient } from '@/lib/http';
import { IAuthResponse, ILoginDto, IRegisterDto } from '../../common/interfaces/auth.interface';

const BASE_URL = '/auth';

export const authService = {
  login: async (credentials: ILoginDto): Promise<IAuthResponse> => {
    const response = await httpClient.post<IAuthResponse>(`${BASE_URL}/login`, credentials);
    return response.data;
  },

  register: async (credentials: IRegisterDto): Promise<IAuthResponse> => {
    const response = await httpClient.post<IAuthResponse>(`${BASE_URL}/register`, credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await httpClient.post(`${BASE_URL}/logout`);
  },
}; 