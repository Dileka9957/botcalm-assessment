import type { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '@/stores/authStore';

interface PrivateRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

const PrivateRoute: FC<PrivateRouteProps> = ({
  children,
  redirectTo = '/login',
}) => {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <>{children}</> : <Navigate to={redirectTo} replace />;
};

export default PrivateRoute;
