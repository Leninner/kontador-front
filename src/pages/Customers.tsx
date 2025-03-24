import { columns } from "../modules/customers/columns"
import { DataTable } from "../modules/customers/data-table"
import { payments } from "../common/interfaces/customers.interface"

export const CustomersPage = () => {
	const data = payments;

	return (
		<div className="container mx-auto py-10">
			<DataTable columns={columns} data={data} />
		</div>
	)
}
