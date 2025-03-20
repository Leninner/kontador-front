import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

interface PublicRouteProps {
	children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
	const location = useLocation();
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	if (isAuthenticated) {
		return <Navigate to="/dashboard" state={{ from: location }} replace />;
	}

	return <>{children}</>;
}; 