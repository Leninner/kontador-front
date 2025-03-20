import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth/auth.service';

export const Dashboard = () => {
	const navigate = useNavigate();
	const { user, logout } = useAuthStore();

	const handleLogout = async () => {
		await authService.logout();
		logout();
		navigate('/login');
	};

	return (
		<div className="p-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Dashboard</h1>
					<p className="mt-4">Welcome, {user?.name}!</p>
				</div>
				<Button variant="outline" onClick={handleLogout}>
					Logout
				</Button>
			</div>
		</div>
	);
}; 