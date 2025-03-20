export interface HttpRequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  data?: unknown;
}

export interface HttpResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface HttpClient {
  get<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
  post<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
  put<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
  delete<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
  patch<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
} 