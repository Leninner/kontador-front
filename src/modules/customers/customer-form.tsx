import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { CreateCustomerDto, UpdateCustomerDto } from './customers.interface'

const formSchema = z.object({
	name: z.string().min(3, 'Nombre debe tener al menos 3 caracteres'),
	lastName: z.string().min(3, 'Apellido debe tener al menos 3 caracteres'),
	email: z.string().email('Correo electrónico inválido'),
	documentId: z.string().min(9, 'Número de documento debe tener al menos 9 caracteres'),
	documentType: z.string(),
})

interface CustomerFormProps {
	initialData?: CreateCustomerDto
	onSubmit: (data: CreateCustomerDto | UpdateCustomerDto) => void
	isLoading?: boolean
}

export function CustomerForm({ initialData, onSubmit, isLoading }: CustomerFormProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			name: '',
			lastName: '',
			email: '',
			documentId: '',
			documentType: 'CI',
		},
	})

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="grid grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nombre</FormLabel>
								<FormControl>
									<Input placeholder="John" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="lastName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Apellido</FormLabel>
								<FormControl>
									<Input placeholder="Doe" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder="john@example.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex gap-4">
					<FormField
						control={form.control}
						name="documentType"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tipo</FormLabel>
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select a document type" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="RUC">RUC</SelectItem>
										<SelectItem value="CI">CI</SelectItem>
										<SelectItem value="PASSPORT">Pasaporte</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="documentId"
						render={({ field }) => (
							<FormItem className="flex-1">
								<FormLabel>Número de documento</FormLabel>
								<FormControl>
									<Input placeholder="12345678" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex justify-end">
					<Button type="submit" disabled={isLoading} className="flex-1">
						{isLoading ? 'Guardando...' : 'Guardar'}
					</Button>
				</div>
			</form >
		</Form >
	)
} 