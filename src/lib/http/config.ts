import { AxiosRequestConfig } from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const defaultConfig: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}
