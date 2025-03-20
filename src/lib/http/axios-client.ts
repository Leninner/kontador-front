import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { HttpClient, HttpRequestConfig, HttpResponse } from './types';

export class AxiosHttpClient implements HttpClient {
  private client: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    this.client = axios.create(config);
  }

  addRequestInterceptor(onFulfilled: (config: any) => any, onRejected?: (error: any) => any) {
    return this.client.interceptors.request.use(onFulfilled, onRejected);
  }

  addResponseInterceptor(onFulfilled: (response: any) => any, onRejected?: (error: any) => any) {
    return this.client.interceptors.response.use(onFulfilled, onRejected);
  }

  private transformResponse<T>(response: AxiosResponse<T>): HttpResponse<T> {
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>,
    };
  }

  async get<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    const response = await this.client.get<T>(url, config);
    return this.transformResponse(response);
  }

  async post<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    const response = await this.client.post<T>(url, data, config);
    return this.transformResponse(response);
  }

  async put<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    const response = await this.client.put<T>(url, data, config);
    return this.transformResponse(response);
  }

  async delete<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    const response = await this.client.delete<T>(url, config);
    return this.transformResponse(response);
  }

  async patch<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    const response = await this.client.patch<T>(url, data, config);
    return this.transformResponse(response);
  }
} 