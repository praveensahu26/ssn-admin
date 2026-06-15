import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { ROUTES } from '@/config/routes';
import { useAuthData } from '@/hooks/useAuthData';
import { toast } from '@/lib/toast';
import { authServices } from '@/services/authServices';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthData();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      keepLoggedIn: false,
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, helpers) => {
      try {
        const response = await authServices.login({
          email: values.email,
          password: values.password,
        });

        if (!response.data) {
          throw new Error('Login response missing user data');
        }

        login(
          response.data.user,
          response.data.tokens.access.token,
          response.data.tokens.refresh.token
        );
        toast.success(response.message || 'Super admin logged in successfully');
        navigate(ROUTES.dashboard, { replace: true });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Login failed');
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <AuthLayout>
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-heading font-semibold  text-text-primary mb-2">
            Welcome Back, Admin
          </h1>
          <p className="text-base-custom font-medium text-text-secondary">
            Manage content, verify reports, and keep the news platform running smoothly.
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-md-custom font-medium text-text-small mb-2"
            >
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-[#A5B5C6]" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter Your Email"
                className={`block w-full pl-11 pr-4 py-3.5 bg-white border ${formik.touched.email && formik.errors.email
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-[#CBD5E1] focus:ring-blue-100 focus:border-[#007AFF]'
                  } rounded-lg text-md-custom text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-4 transition-all duration-200`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1.5 text-[13px] text-red-500 font-medium">
                {formik.errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-md-custom font-medium text-text-small mb-2"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[#A5B5C6]" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter Your Password"
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

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2.5 cursor-pointer group">
              <input
                type="checkbox"
                name="keepLoggedIn"
                className="h-4.5 w-4.5 rounded-sm border-[#A5B5C6] text-[#007AFF] focus:ring-[#007AFF] cursor-pointer"
                onChange={formik.handleChange}
                checked={formik.values.keepLoggedIn}
              />
              <span className="text-base-custom font-regular text-text-secondary  select-none">
                Keep me Logged in
              </span>
            </label>
            <Link
              to={ROUTES.forgotPassword}
              className="text-base-custom font-regular text-text-secondary hover:text-[#007AFF] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full py-4 px-6 bg-btn-primary text-white font-medium rounded-lg  text-md-custom disabled:cursor-not-allowed disabled:opacity-70"
          >
            {formik.isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;

