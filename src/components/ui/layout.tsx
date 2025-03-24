import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { SidebarTrigger } from './sidebar';
import { SidebarProvider } from './sidebar';
import { AppSidebar } from '../app-sidebar';

interface LayoutProps {
	children: ReactNode;
	requireAuth?: boolean;
}

export function AppLayout({ children, requireAuth = true }: LayoutProps) {
	const { isAuthenticated } = useAuthStore();
	const location = useLocation();

	if (requireAuth && !isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="flex-1 overflow-y-auto">
				<SidebarTrigger />
				{children}
			</main>
		</SidebarProvider>

	);
}
