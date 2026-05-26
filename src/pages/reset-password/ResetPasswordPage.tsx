import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { ROUTES } from '@/config/routes';
import { toast } from 'sonner';

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
    .required('New Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: () => {

      toast.success('Password has been reset successfully!');
      // Dummy success logic - just navigate to login since no API integration is requested
      navigate(ROUTES.login);
    },
  });

  return (
    <AuthLayout>
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-heading font-semibold  text-text-primary mb-2">
            Create a New Password
          </h1>
          <p className="text-base-custom font-medium text-text-secondary">
            Enter a strong new password to secure your <br /> account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* New Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-md-custom font-medium text-text-small mb-2"
            >
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[#A5B5C6]" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter New Password"
                className={`block w-full pl-11 pr-12 py-3.5 bg-white border ${formik.touched.password && formik.errors.password
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-[#CBD5E1] focus:ring-blue-100 focus:border-[#007AFF]'
                  } rounded-lg text-md-custom text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-4 transition-all duration-200`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#94A3B8] hover:text-[#64748B] transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="mt-1.5 text-[13px] text-red-500 font-medium">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-md-custom font-medium text-text-small mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[#A5B5C6]" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Your Password"
                className={`block w-full pl-11 pr-12 py-3.5 bg-white border ${formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-[#CBD5E1] focus:ring-blue-100 focus:border-[#007AFF]'
                  } rounded-lg text-md-custom text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-4 transition-all duration-200`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#94A3B8] hover:text-[#64748B] transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="mt-1.5 text-[13px] text-red-500 font-medium">
                {formik.errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Reset Password Button */}
          <button
            type="submit"
            className="w-full py-4 px-6 bg-btn-primary text-white font-medium rounded-lg  text-md-custom"
          >
            Reset Password
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
