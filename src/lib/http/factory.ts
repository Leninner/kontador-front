import { HttpClient } from './types'
import { AxiosHttpClient } from './axios-client'
import { defaultConfig } from './config'
import { AxiosRequestConfig } from 'axios'
import { useAuthStore } from '../../store/useAuthStore'

export class HttpClientFactory {
  private static instance: HttpClient

  static getInstance(): HttpClient {
    if (!this.instance) {
      this.instance = new AxiosHttpClient(defaultConfig)
    }
    return this.instance
  }
}

export const httpClient = new AxiosHttpClient({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor for authentication
httpClient.addRequestInterceptor((config: AxiosRequestConfig) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor for handling auth errors
httpClient.addResponseInterceptor(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
