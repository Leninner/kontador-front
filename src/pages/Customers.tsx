import { columns } from "../modules/customers/columns"
import { DataTable } from "../modules/customers/data-table"
import { customers } from "../modules/customers/customers.interface"

export const CustomersPage = () => {
	const data = customers;

	return (
		<div className="container mx-auto py-10">
			<DataTable columns={columns} data={data} />
		</div>
	)
}
