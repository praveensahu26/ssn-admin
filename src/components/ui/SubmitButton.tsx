import React from 'react';
import { Spinner } from '@/components/ui/spinner';

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
}

export function SubmitButton({ isLoading, fullWidth, leftIcon, className = '', children, ...props }: SubmitButtonProps) {
  return (
    <button
      type="button"
      {...props}
      disabled={isLoading || props.disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-btn-primary px-5 py-2.5 text-md-custom font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
    >
      {isLoading ? <Spinner size={16} className="text-white" /> : leftIcon}
      {children}
    </button>
  );
}

export default SubmitButton;
