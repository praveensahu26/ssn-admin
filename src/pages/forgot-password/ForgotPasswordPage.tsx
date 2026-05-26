import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { ROUTES } from '@/config/routes';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: ForgotPasswordSchema,
    onSubmit: () => {

      // Dummy success logic - just navigate to verify email since no API integration is requested
      navigate(ROUTES.verifyEmail);
    },
  });

  return (
    <AuthLayout>
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-heading font-semibold  text-text-primary mb-2">
            Forgot Password?
          </h1>
          <p className="text-base-custom font-medium text-text-secondary">
            Enter your registered email to receive a verification <br /> code.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Email Field */}
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

          {/* Continue Button */}
          <button
            type="submit"
            className="w-full py-4 px-6 bg-btn-primary text-white font-medium rounded-lg  text-md-custom"
          >
            Continue
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
