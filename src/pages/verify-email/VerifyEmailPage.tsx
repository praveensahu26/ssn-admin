import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { ROUTES } from '@/config/routes';
import { toast } from '@/lib/toast';
import { authServices } from '@/services/authServices';
import { RESET_EMAIL_STORAGE_KEY } from '@/services/authStorage';

const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const length = 6;
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const email = localStorage.getItem(RESET_EMAIL_STORAGE_KEY) || '';

  const handleChange = (index: number, value: string) => {
    if (value !== '' && !/^[0-9]$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();

    if (!/^\d+$/.test(pastedData)) {
      toast.error('Only digits are allowed');
      return;
    }

    const pastedDigits = pastedData.slice(0, length).split('');
    const newOtp = [...otp];

    pastedDigits.forEach((digit, i) => {
      newOtp[i] = digit;
    });

    setOtp(newOtp);
    const focusIndex = Math.min(pastedDigits.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');

    if (!email) {
      toast.error('Please enter your email first.');
      navigate(ROUTES.forgotPassword);
      return;
    }

    if (code.length < length) {
      toast.error('Please enter the full 6-digit verification code.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await authServices.verifyOtp({
        email,
        otp: code,
        type: 'reset-password',
      });
      toast.success(response.message || 'OTP verified successfully');
      navigate(ROUTES.resetPassword);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'OTP verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error('Please enter your email first.');
      navigate(ROUTES.forgotPassword);
      return;
    }

    try {
      setIsResending(true);
      const response = await authServices.forgotPassword({ email });
      toast.success(response.message || 'A new verification code has been sent');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-heading font-semibold  text-text-primary mb-2">
            Verify Your Email
          </h1>
          <p className="text-base-custom font-medium text-text-secondary">
            Enter code that we have sent to your email
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-md-custom font-medium text-text-small mb-2">
              Enter Verification Code
            </label>
            <div className="flex  gap-2 justify-start items-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-12 h-12  text-center text-[20px] font-bold bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg shadow-card text-[#1E293B] focus:outline-none focus:border-[#007AFF] focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                />
              ))}
            </div>
          </div>

          <div className="text-base-custom font-regular text-text-secondary">
            Didn't receive a code?{' '}
            <button
              type="button"
              disabled={isResending}
              onClick={handleResend}
              className="text-base-custom font-regular text-btn-primary underline cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isResending ? 'Sending...' : 'Resend'}
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-btn-primary text-white font-medium rounded-lg  text-md-custom disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
