import { apiClient, unwrap } from './apiClient';
import type { ApiResponse } from './apiClient';

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

export const authServices = {
  login: (payload: { email: string; password: string }) =>
    unwrap<LoginResponseData>(apiClient.post('/admin/auth/login', payload)),

  forgotPassword: (payload: { email: string }) =>
    unwrap(apiClient.post('/admin/auth/forgot-password', payload)),

  sendOtp: (payload: { email: string }) => unwrap(apiClient.post('/admin/auth/send-otp', payload)),

  verifyOtp: (payload: {
    email: string;
    otp: string;
    type: 'email-verification' | 'reset-password';
  }) => unwrap(apiClient.post('/admin/auth/verify-otp', payload)),

  resetPassword: (payload: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => unwrap(apiClient.post('/admin/auth/reset-password', payload)),

  refreshToken: (refreshToken: string) =>
    unwrap<{ access: { token: string; expires: string }; refresh: { token: string; expires: string } }>(
      apiClient.post('/admin/auth/refresh-tokens', { refreshToken })
    ),
};

export type { ApiResponse };

