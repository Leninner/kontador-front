import { GalleryVerticalEnd } from 'lucide-react';
import { RegisterForm } from '../components/register-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authService } from '../services/auth/auth.service';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

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
	success: false;
	error: {
		message: string;
		code: string;
	};
}

type ApiResponse = SuccessResponse | ErrorResponse;

export const Register = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const login = useAuthStore((state) => state.login);

	const handleRegister = async (name: string, email: string, password: string) => {
		try {
			const response = await authService.register({ name, email, password }) as ApiResponse;

			if (!response.success) {
				toast.error('Registration failed', {
					description: response.error.message
				});
				return;
			}

			await login({ email, password });
			const from = (location.state as LocationState)?.from?.pathname || '/dashboard';
			toast.success('Registration successful', {
				description: 'Welcome to Kontador!'
			});
			navigate(from, { replace: true });
		} catch (error) {
			const err = error as ErrorResponse;
			if (err.error?.message) {
				toast.error('Registration failed', {
					description: err.error.message
				});
			} else {
				toast.error('Registration failed', {
					description: 'An unexpected error occurred'
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
						<RegisterForm onSubmit={handleRegister} />
						<div className="mt-4 text-center text-sm">
							Ya tienes una cuenta?{' '}
							<Link to="/login" className="text-primary underline">
								Ingresar
							</Link>
						</div>
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