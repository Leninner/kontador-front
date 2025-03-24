import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const Dashboard = () => {
	const navigate = useNavigate();
	const { user, logout } = useAuthStore();

	const handleLogout = async () => {
		try {
			await logout();
			toast.success('Cerraste sesión correctamente');
			navigate('/login');
		} catch {
			toast.error('Error al cerrar sesión');
		}
	};

	return (
		<div className="p-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Panel de control</h1>
					<p className="mt-4">Bienvenido, {user?.name}!</p>
				</div>
				<Button variant="outline" onClick={handleLogout}>
					Cerrar sesión
				</Button>
			</div>
		</div>
	);
}; 