import { useState } from "react"
import { columns } from "../modules/customers/columns"
import { DataTable } from "../modules/customers/data-table"
import { useCustomers } from "../modules/customers/useCustomers"
import { CustomerForm } from "../modules/customers/customer-form"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { CreateCustomerDto } from "@/modules/customers/customers.interface"

export const CustomersPage = () => {
	const [isOpen, setIsOpen] = useState(false)
	const { customers, isLoading, createCustomer } = useCustomers()

	const handleCreate = async (data: CreateCustomerDto) => {
		try {
			await createCustomer.mutateAsync(data)
			setIsOpen(false)
		} catch (error) {
			console.error('Failed to create customer:', error)
		}
	}

	return (
		<div className="container mx-auto py-10">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Clientes</h1>
				<Dialog open={isOpen} onOpenChange={setIsOpen}>
					<DialogTrigger asChild>
						<Button>Adicionar Cliente</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Adicionar Cliente</DialogTitle>
						</DialogHeader>
						<CustomerForm
							onSubmit={handleCreate}
							isLoading={createCustomer.isPending}
						/>
					</DialogContent>
				</Dialog>
			</div>
			<DataTable columns={columns} data={customers} isLoading={isLoading} />
		</div>
	)
}
