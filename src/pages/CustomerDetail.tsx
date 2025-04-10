/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useParams } from "react-router-dom"
import { useCustomers } from "@/modules/customers/useCustomers"
import { CustomerForm } from "@/modules/customers/customer-form"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { CustomerDocuments } from "@/modules/customers/customer-documents"
import { UpdateCustomerDto, Customer } from "@/modules/customers/customers.interface"
import { useState } from "react"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, Edit2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export const CustomerDetail = () => {
	const { id } = useParams<{ id: string }>()
	const [isEditOpen, setIsEditOpen] = useState(false)
	const { customersData, updateCustomer } = useCustomers()
	const customer = customersData.data.find((c: Customer) => c.id === id)

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
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<Link to="/customers" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-fit">
					<ArrowLeft className="size-4" />
					<span>Back to Customers</span>
				</Link>
				<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
					<DialogTrigger asChild>
						<Button variant="outline" className="gap-2 w-full sm:w-auto">
							<Edit2 className="size-4" />
							Edit Customer
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Edit Customer</DialogTitle>
						</DialogHeader>
						<CustomerForm
							initialData={customer}
							onSubmit={handleUpdate as any}
							isLoading={updateCustomer.isPending}
						/>
					</DialogContent>
				</Dialog>
			</div>

			<div className="space-y-6 sm:space-y-8">
				<Card className="w-full">
					<CardHeader className="space-y-2">
						<CardTitle className="text-xl sm:text-2xl lg:text-3xl">{customer.name} {customer.lastName}</CardTitle>
						<p className="text-sm sm:text-base text-muted-foreground">{customer.email}</p>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
							<div className="space-y-1">
								<h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Document Type</h3>
								<p className="text-base sm:text-lg">{customer.documentType}</p>
							</div>
							<div className="space-y-1">
								<h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Document Number</h3>
								<p className="text-base sm:text-lg">{customer.documentId}</p>
							</div>
							<div className="space-y-1">
								<h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Created At</h3>
								<p className="text-base sm:text-lg">
									{new Date(customer.createdAt).toLocaleDateString()}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Separator className="my-4 sm:my-6" />

				<div className="space-y-4">
					<h2 className="text-xl sm:text-2xl font-semibold">Documents</h2>
					<CustomerDocuments customerId={customer.id} />
				</div>
			</div>
		</div>
	)
} 