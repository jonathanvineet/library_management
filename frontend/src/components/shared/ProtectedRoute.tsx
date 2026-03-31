import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getStoredRole } from '@/hooks/useAuth';
import type { UserRole } from '@/types';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const RoleRoute = ({ children, allowedRoles }: { children: ReactNode; allowedRoles: UserRole[] }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  const role = getStoredRole();
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};
