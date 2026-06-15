import axios, { AxiosError } from 'axios';
import { env } from '@/config/env';
import { getAccessToken } from './authStorage';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isSuperAdmin?: boolean;
  isVerified?: boolean;
  status?: string;
  permissions?: string[];
}

interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
}

interface LoginResponseData {
  user: AuthUser;
  tokens: {
    access: {
      token: string;
      expires: string;
    };
    refresh: {
      token: string;
      expires: string;
    };
  };
}

const api = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data as Partial<ApiResponse> | undefined;
    return responseData?.message || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong';
}

async function unwrap<T>(request: Promise<{ data: ApiResponse<T> }>) {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export const authServices = {
  login: (payload: { email: string; password: string }) =>
    unwrap<LoginResponseData>(api.post('/auth/login', payload)),

  forgotPassword: (payload: { email: string }) =>
    unwrap(api.post('/auth/forgot-password', payload)),

  sendOtp: (payload: { email: string }) => unwrap(api.post('/auth/send-otp', payload)),

  verifyOtp: (payload: {
    email: string;
    otp: string;
    type: 'email-verification' | 'reset-password';
  }) => unwrap(api.post('/auth/verify-otp', payload)),

  resetPassword: (payload: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => unwrap(api.post('/auth/reset-password', payload)),
};

