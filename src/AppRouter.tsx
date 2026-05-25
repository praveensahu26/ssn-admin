import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner';
import { ROUTES } from '@/config/routes';
import ProtectedRoute from './ProtectedRoute';

const DashboardPage = lazy(() => import('@/pages/dashboard/Dashboard'));

function RouteFallback() {
  return (
    <div role="status" aria-live="polite" className="flex min-h-screen items-center justify-center">
      <Spinner size={28} />
    </div>
  );
}

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path={ROUTES.root} element={<Navigate to={ROUTES.dashboard} replace />} />
          <Route path={ROUTES.login} element={<div>Login Page Mock</div>} />

          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.dashboard} element={<DashboardPage />} />
          </Route>

          <Route path={ROUTES.notFound} element={<div className="p-8">404 - Page Not Found</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
