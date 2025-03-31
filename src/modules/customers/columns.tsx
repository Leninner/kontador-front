import { ColumnDef } from "@tanstack/react-table"
import { Customer } from "./customers.interface"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { Checkbox } from "../../components/ui/checkbox"

export const columns: ColumnDef<Customer>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Seleccionar todos"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Seleccionar fila"
			/>
		),
		enableSorting: false,
		enableHiding: false,
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
					<ArrowUpDown />
				</Button>
			)
		},
		cell: ({ row }) => <div className="lowercase">{row.getValue("lastName")}</div>,
	},
	{
		accessorKey: "email",
		header: () => <div className="text-right">Email</div>,
		cell: ({ row }) => <div className="text-right font-medium">{row.getValue("email")}</div>,
	},
	{
		accessorKey: "documentNumber",
		header: () => <div className="text-right">Número de documento</div>,
		cell: ({ row }) => <div className="text-right font-medium">{row.getValue("documentNumber")}</div>,
	},
	{
		accessorKey: "documentType",
		header: () => <div className="text-right">Tipo de documento</div>,
		cell: ({ row }) => {
			const documentType = row.getValue("documentType") as string

			return <div className="text-right font-medium">{documentType}</div>
		},
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const payment = row.original

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Abrir menú</span>
							<MoreHorizontal />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Acciones</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(payment.id)}
						>
							Copiar ID del cliente
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Ver detalles del cliente</DropdownMenuItem>
						<DropdownMenuItem>Ver detalles de la compra</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	},
]