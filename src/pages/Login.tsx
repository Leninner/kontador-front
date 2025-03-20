import { GalleryVerticalEnd } from 'lucide-react';
import { LoginForm } from '../components/login-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/auth/auth.service';
import { useAuthStore } from '@/store/useAuthStore';

interface LocationState {
	from?: {
		pathname: string;
	};
}

export const Login = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const login = useAuthStore((state) => state.login);

	const handleLogin = async (email: string, password: string) => {
		const response = await authService.login({ email, password });

		if (response.success && response.token && response.user) {
			login(response.user, response.token);
			const from = (location.state as LocationState)?.from?.pathname || '/dashboard';
			navigate(from, { replace: true });
		}
	};

	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			<div className="flex flex-col gap-4 p-6 md:p-10">
				<div className="flex justify-center gap-2 md:justify-start">
					<a href="#" className="flex items-center gap-2 font-medium">
						<div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
							<GalleryVerticalEnd className="size-4" />
						</div>
						Kontador
					</a>
				</div>
				<div className="flex flex-1 items-center justify-center">
					<div className="w-full max-w-xs">
						<LoginForm onSubmit={handleLogin} />
					</div>
				</div>
			</div>
			<div className="relative hidden bg-muted lg:block">
				<img
					src="/login.jpg"
					alt="Image"
					className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
				/>
			</div>
		</div>
	);
}; 