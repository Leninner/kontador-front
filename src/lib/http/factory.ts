import { HttpClient } from './types';
import { AxiosHttpClient } from './axios-client';
import { defaultConfig } from './config';

export class HttpClientFactory {
  private static instance: HttpClient;

  static getInstance(): HttpClient {
    if (!this.instance) {
      this.instance = new AxiosHttpClient(defaultConfig);
    }
    return this.instance;
  }
} 