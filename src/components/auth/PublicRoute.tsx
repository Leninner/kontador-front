import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

interface PublicRouteProps {
	children: ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
	const { user, isLoading } = useAuthStore();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (user) {
		return <Navigate to="/dashboard" replace />;
	}

	return <>{children}</>;
}; 