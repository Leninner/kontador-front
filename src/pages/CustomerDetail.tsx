import { Link, useParams } from "react-router-dom"
import { useCustomers } from "@/modules/customers/useCustomers"
import { CustomerForm } from "@/modules/customers/customer-form"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomerDocuments } from "@/modules/customers/customer-documents"
import { UpdateCustomerDto } from "@/modules/customers/customers.interface"
import { useState } from "react"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft } from "lucide-react"

export const CustomerDetail = () => {
	const { id } = useParams<{ id: string }>()
	const [isEditOpen, setIsEditOpen] = useState(false)
	const { customers, updateCustomer } = useCustomers()
	const customer = customers.find(c => c.id === id)

	if (!customer) {
		return <div>Customer not found</div>
	}

	const handleUpdate = async (data: UpdateCustomerDto) => {
		try {
			await updateCustomer.mutateAsync({ id: customer.id, data })
			setIsEditOpen(false)
		} catch (error) {
			console.error('Failed to update customer:', error)
		}
	}

	return (
		<div className="container mx-auto py-10">
			<Link to="/customers" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6">
				<ArrowLeft className="size-4" />
				<span>Clientes</span>
			</Link>

			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-2xl font-bold">{customer.name} {customer.lastName}</h1>
					<p className="text-muted-foreground">{customer.email}</p>
				</div>
				<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
					<DialogTrigger asChild>
						<Button>Editar cliente</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Editar cliente</DialogTitle>
						</DialogHeader>
						<CustomerForm
							initialData={customer}
							onSubmit={handleUpdate}
							isLoading={updateCustomer.isPending}
						/>
					</DialogContent>
				</Dialog>
			</div>

			<Tabs defaultValue="info" className="space-y-4">
				<TabsList>
					<TabsTrigger value="info">Información básica</TabsTrigger>
					<TabsTrigger value="documents">Documentos</TabsTrigger>
				</TabsList>

				<TabsContent value="info">
					<Card>
						<CardHeader>
							<CardTitle>Detalles del cliente</CardTitle>
							<CardDescription>Información básica del cliente</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<h3 className="font-medium">Nombre</h3>
									<p className="text-muted-foreground">{customer.name}</p>
								</div>
								<div>
									<h3 className="font-medium">Apellido</h3>
									<p className="text-muted-foreground">{customer.lastName}</p>
								</div>
								<div>
									<h3 className="font-medium">Correo electrónico</h3>
									<p className="text-muted-foreground">{customer.email}</p>
								</div>
								<div>
									<h3 className="font-medium">Tipo de documento</h3>
									<p className="text-muted-foreground">{customer.documentType}</p>
								</div>
								<div>
									<h3 className="font-medium">Número de documento</h3>
									<p className="text-muted-foreground">{customer.documentId}</p>
								</div>
								<div>
									<h3 className="font-medium">Fecha de creación</h3>
									<p className="text-muted-foreground">
										{new Date(customer.createdAt).toLocaleDateString()}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="documents">
					<CustomerDocuments customerId={customer.id} />
				</TabsContent>
			</Tabs>
		</div>
	)
} 