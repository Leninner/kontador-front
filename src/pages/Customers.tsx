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
import { useTablePagination } from "@/hooks/useTablePagination"
import { ColumnFiltersState } from "@tanstack/react-table"
import { useSearchParams } from "react-router-dom"

export const CustomersPage = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [searchParams, setSearchParams] = useSearchParams()
	const { handlePaginationChange, page, limit } = useTablePagination()

	console.log(page, limit)

	const { customersData, isLoading, createCustomer } = useCustomers({
		page,
		limit,
		search: searchParams.get('search') || undefined,
	})

	const handleCreate = async (data: CreateCustomerDto) => {
		try {
			await createCustomer.mutateAsync(data)
			setIsOpen(false)
		} catch (error) {
			console.error('Failed to create customer:', error)
		}
	}

	const handleFilterChange = (filters: ColumnFiltersState) => {
		const newSearchParams = new URLSearchParams(searchParams)
		const searchFilter = filters.find(f => f.id === 'email')
		if (searchFilter) {
			newSearchParams.set('search', searchFilter.value as string)
		} else {
			newSearchParams.delete('search')
		}
		setSearchParams(newSearchParams)
	}

	return (
		<div className="container mx-auto py-10">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Clientes</h1>
				<Dialog open={isOpen} onOpenChange={setIsOpen}>
					<DialogTrigger asChild>
						<Button>Nuevo Cliente</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Adicionar Cliente</DialogTitle>
						</DialogHeader>
						<CustomerForm
							onSubmit={(data) => handleCreate(data as CreateCustomerDto)}
							isLoading={createCustomer.isPending}
						/>
					</DialogContent>
				</Dialog>
			</div>
			<DataTable
				columns={columns}
				data={customersData.data}
				isLoading={isLoading}
				meta={customersData.meta}
				onPaginationChange={handlePaginationChange}
				onFilterChange={handleFilterChange}
			/>
		</div>
	)
}
