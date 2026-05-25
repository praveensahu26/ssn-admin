import { toast as sonnerToast } from 'sonner';

interface ToastOptions {
  description?: string;
  duration?: number;
}

export const toast = {
  success: (message: string, options?: ToastOptions) =>
    sonnerToast.success(message, options),

  error: (message: string, options?: ToastOptions) =>
    sonnerToast.error(message, options),

  warning: (message: string, options?: ToastOptions) =>
    sonnerToast.warning(message, options),

  info: (message: string, options?: ToastOptions) =>
    sonnerToast.info(message, options),

  message: (message: string, options?: ToastOptions) =>
    sonnerToast(message, options),

  promise: sonnerToast.promise,
};
