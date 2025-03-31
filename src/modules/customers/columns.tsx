import { ColumnDef } from "@tanstack/react-table"
import { Customer } from "./customers.interface"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { useCustomers } from "./useCustomers"
import { Link } from "react-router-dom"
import { Badge } from "../../components/ui/badge"

const CustomerActions = ({ customer }: { customer: Customer }) => {
	const { deleteCustomer } = useCustomers()

	const handleDelete = async () => {
		try {
			await deleteCustomer.mutateAsync(customer.id)
		} catch (error) {
			console.error('Failed to delete customer:', error)
		}
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-8 w-8 p-0">
					<span className="sr-only">Abrir menu</span>
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Acciones</DropdownMenuLabel>
				<DropdownMenuItem
					onClick={() => navigator.clipboard.writeText(customer.id)}
				>
					Copiar ID del cliente
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link to={`/customers/${customer.id}`}>Ver detalles del cliente</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="text-red-600"
					onClick={handleDelete}
				>
					Eliminar cliente
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export const columns: ColumnDef<Customer>[] = [
	{
		accessorKey: "documentId",
		header: () => <div className="text-left">Número de documento</div>,
		cell: ({ row }) => <div className="text-left font-medium">{row.getValue("documentId")}</div>,
	},
	{
		accessorKey: "documentType",
		header: () => <div className="text-left">Tipo de documento</div>,
		cell: ({ row }) => {
			const documentType = row.getValue("documentType") as string

			const resolveBadgeVariant = (documentType: string) => {
				switch (documentType) {
					case "RUC":
						return "secondary"
					case "CI":
						return "default"
					default:
						return "outline"
				}
			}

			return <Badge variant={resolveBadgeVariant(documentType)}>{documentType}</Badge>
		},
	},
	{
		accessorKey: "name",
		header: "Nombre",
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("name")}</div>
		),
	},
	{
		accessorKey: "lastName",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Apellido
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => <div className="capitalize">{row.getValue("lastName")}</div>,
	},
	{
		accessorKey: "email",
		header: () => <div className="text-left">Correo electrónico</div>,
		cell: ({ row }) => <div className="text-left font-medium">{row.getValue("email")}</div>,
	},

	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => <CustomerActions customer={row.original} />,
	},
]