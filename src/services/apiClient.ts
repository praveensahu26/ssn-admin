import axios, { AxiosError } from 'axios';
import { env } from '@/config/env';
import { clearAuthStorage, getAccessToken, notifyAuthExpired } from './authStorage';

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
}

export const apiClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse>) => {
    const statusCode = error.response?.status;
    const message = error.response?.data?.message?.toLowerCase() ?? '';
    const hadToken = Boolean(getAccessToken());

    if (statusCode === 401 && hadToken && message.includes('jwt expired')) {
      clearAuthStorage();
      notifyAuthExpired();
    }

    return Promise.reject(error);
  }
);

function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data as Partial<ApiResponse> | undefined;
    const message = responseData?.message || error.message;

    if (message.toLowerCase().includes('jwt expired')) {
      return 'Your session expired. Please log in again.';
    }

    return message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong';
}

export async function unwrap<T>(request: Promise<{ data: ApiResponse<T> }>) {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
