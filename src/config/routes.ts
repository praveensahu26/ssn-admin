export const ROUTES = {
  root: '/',
  login: '/login',
  forgotPassword: '/forgot-password',
  verifyEmail: '/verify-email',
  resetPassword: '/reset-password',
  dashboard: '/dashboard',
  users: '/users',
  reporters: '/reporters',
  notFound: '*',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
