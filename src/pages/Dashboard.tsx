import { useAuthStore } from '@/store/useAuthStore';
import { SidebarInset } from '../components/ui/sidebar';
import { Separator } from '@radix-ui/react-separator';

export const Dashboard = () => {
	const { user } = useAuthStore();


	return (
		<SidebarInset>
			<div className="p-6">
				<header className="flex h-16 shrink-0 items-center gap-2">
					<div className="flex items-center gap-2 px-4">
						<div>
							<h1 className="text-2xl font-bold">Panel de control</h1>
							<p className="mt-4">Bienvenido, {user?.name}!</p>
						</div>

						<Separator orientation="vertical" className="mr-2 h-4" />
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
					<div className="grid auto-rows-min gap-4 md:grid-cols-3">
						<div className="aspect-video rounded-xl bg-muted/50" />
						<div className="aspect-video rounded-xl bg-muted/50" />
						<div className="aspect-video rounded-xl bg-muted/50" />
					</div>
					<div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
				</div>
			</div>
		</SidebarInset>
	);
}; 