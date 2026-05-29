import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner';
import { ROUTES } from '@/config/routes';
import ProtectedRoute from './ProtectedRoute';

const DashboardPage = lazy(() => import('@/pages/dashboard/Dashboard'));
const UsersPage = lazy(() => import('@/pages/users/UsersPage'));
const UserProfileDetailsPage = lazy(() => import('@/pages/users/[username]/UserProfileDetails'));
const ReportersPage = lazy(() => import('@/pages/reporters/ReportersPage'));
const ReporterProfileDetailsPage = lazy(() => import('@/pages/reporters/[username]/ReporterProfileDetails'));
const LoginPage = lazy(() => import('@/pages/login/LoginPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/forgot-password/ForgotPasswordPage'));
const VerifyEmailPage = lazy(() => import('@/pages/verify-email/VerifyEmailPage'));
const ResetPasswordPage = lazy(() => import('@/pages/reset-password/ResetPasswordPage'));

function RouteFallback() {
  return (
    <div role="status" aria-live="polite" className="flex min-h-screen items-center justify-center">
      <Spinner size={30} />
    </div>
  );
}

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path={ROUTES.root} element={<Navigate to={ROUTES.dashboard} replace />} />
          <Route path={ROUTES.login} element={<LoginPage />} />
          <Route path={ROUTES.forgotPassword} element={<ForgotPasswordPage />} />
          <Route path={ROUTES.verifyEmail} element={<VerifyEmailPage />} />
          <Route path={ROUTES.resetPassword} element={<ResetPasswordPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.dashboard} element={<DashboardPage />} />
            <Route path={ROUTES.users} element={<UsersPage />} />
            <Route path={`${ROUTES.users}/:username`} element={<UserProfileDetailsPage />} />
            <Route path={ROUTES.reporters} element={<ReportersPage />} />
            <Route path={`${ROUTES.reporters}/:username`} element={<ReporterProfileDetailsPage />} />
          </Route>

          <Route path={ROUTES.notFound} element={<div className="p-8 flex items-center justify-center h-screen text-3xl font-bold text-black">404 - Page Not Found</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
