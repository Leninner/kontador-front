import { GalleryVerticalEnd } from 'lucide-react';
import { LoginForm } from '../components/login-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authService } from '../modules/auth/auth.service';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

interface LocationState {
	from?: {
		pathname: string;
	};
}

interface AuthData {
	user: {
		id: string;
		name: string;
		email: string;
	};
	token: string;
}

interface SuccessResponse {
	success: true;
	data: AuthData;
}

interface ErrorResponse {
	statusCode: number;
	error: string;
	message: string | string[];
}

type ApiResponse = SuccessResponse | ErrorResponse;

export const Login = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const login = useAuthStore((state) => state.login);

	const handleLogin = async (email: string, password: string) => {
		try {
			const response = await authService.login({ email, password }) as ApiResponse;

			if ('statusCode' in response) {
				toast.error('Error al iniciar sesión');
				return;
			}

			await login({ email, password });
			const from = (location.state as LocationState)?.from?.pathname || '/dashboard';
			toast.success('Inicio de sesión exitoso');
			navigate(from, { replace: true });
		} catch (error) {
			const err = error as AxiosError<ErrorResponse>;
			if (err.response?.data.message) {
				toast.error('Error al iniciar sesión', {
					description: Array.isArray(err.response?.data.message) ? err.response?.data.message[0] : err.response?.data.message
				});
			} else {
				toast.error('Ocurrió un error inesperado', {
					description: 'Por favor, intenta nuevamente'
				});
			}
		}
	};

	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			<div className="flex flex-col gap-4 p-6 md:p-10">
				<div className="flex justify-center gap-2 md:justify-start">
					<Link to="/" className="flex items-center gap-2 font-medium">
						<div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
							<GalleryVerticalEnd className="size-4" />
						</div>
						Kontador
					</Link>
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