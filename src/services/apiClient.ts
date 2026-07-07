import axios, { AxiosError } from 'axios';
import { env } from '@/config/env';
import { clearAuthStorage, getAccessToken, getRefreshToken, setAccessToken, setRefreshToken, notifyAuthExpired } from './authStorage';
import { authServices } from './authServices';

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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
  async (error: AxiosError<ApiResponse>) => {
    const statusCode = error.response?.status;
    const hadToken = Boolean(getAccessToken());

    // Handle any 401 error when we had a token (session expired, invalid token, etc.)
    if (statusCode === 401 && hadToken) {
      const refreshToken = getRefreshToken();
      
      if (refreshToken) {
        try {
          const response = await authServices.refreshToken(refreshToken);
          if (response.data) {
            setAccessToken(response.data.access.token);
            setRefreshToken(response.data.refresh.token);
            
            // Retry the original request with new token
            const originalRequest = error.config;
            if (originalRequest) {
              originalRequest.headers.Authorization = `Bearer ${response.data.access.token}`;
              return apiClient(originalRequest);
            }
          } else {
            // Invalid response, clear auth and notify
            clearAuthStorage();
            notifyAuthExpired();
          }
        } catch (refreshError) {
          // Refresh failed, clear auth and notify
          clearAuthStorage();
          notifyAuthExpired();
          return Promise.reject(error);
        }
      } else {
        // No refresh token available, clear auth and notify
        clearAuthStorage();
        notifyAuthExpired();
      }
    }

    return Promise.reject(error);
  }
);

function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data as Partial<ApiResponse> | undefined;
    const message = responseData?.message || error.message;

    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('session expired') || lowerMessage.includes('jwt expired')) {
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
