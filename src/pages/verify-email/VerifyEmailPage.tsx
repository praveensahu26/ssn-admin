import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { ROUTES } from '@/config/routes';
import { toast } from 'sonner';

const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const length = 6;
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value !== '' && !/^[0-9]$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Focus next input if a digit is entered
    if (value !== '' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        // Move focus to previous input on backspace if current is empty
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();

    // Check if pasted value is numeric
    if (!/^\d+$/.test(pastedData)) {
      toast.error('Only digits are allowed');
      return;
    }

    const pastedDigits = pastedData.slice(0, length).split('');
    const newOtp = [...otp];

    pastedDigits.forEach((digit, i) => {
      newOtp[i] = digit;
      if (inputRefs.current[i]) {
        inputRefs.current[i]!.value = digit;
      }
    });

    setOtp(newOtp);

    // Focus the last filled input or the last input
    const focusIndex = Math.min(pastedDigits.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');

    if (code.length < length) {
      toast.error('Please enter the full 6-digit verification code.');
      return;
    }


    toast.success('Email verified successfully!');
    // Navigate to reset password
    navigate(ROUTES.resetPassword);
  };

  return (
    <AuthLayout>
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-heading font-semibold  text-text-primary mb-2">
            Verify Your Email
          </h1>
          <p className="text-base-custom font-medium text-text-secondary">
            Enter code that we have sent to your email
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* OTP Input Container */}
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
                  onPaste={index === 0 ? handlePaste : undefined} // Allow paste on the first or any box
                  className="w-12 h-12  text-center text-[20px] font-bold bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg shadow-card text-[#1E293B] focus:outline-none focus:border-[#007AFF] focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                />
              ))}
            </div>
          </div>

          {/* Resend Link */}
          <div className="text-base-custom font-regular text-text-secondary">
            Didn't receive a code?{' '}
            <button
              type="button"
              onClick={() => toast.success('A new verification code has been sent!')}
              className="text-base-custom font-regular text-btn-primary underline cursor-pointer"
            >
              Resend
            </button>
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            className="w-full py-4 px-6 bg-btn-primary text-white font-medium rounded-lg  text-md-custom"
          >
            Verify
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
