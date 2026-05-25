import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { useAuthData } from '@/hooks/useAuthData';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  redirectTo?: string;
  children?: ReactNode;
}

export function ProtectedRoute({
  allowedRoles,
  redirectTo = ROUTES.login,
  children,
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthData();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!user || !allowedRoles.includes(user.role)) {
      return <Navigate to={ROUTES.dashboard} replace />;
    }
  }

  return <>{children ?? <Outlet />}</>;
}

export default ProtectedRoute;
