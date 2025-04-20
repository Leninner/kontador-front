import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Declaration, DECLARATION_FORMS, DeclarationForm as IDeclarationForm } from './declarations.interface'
import { format } from 'date-fns'
import { Separator } from '@/components/ui/separator'

interface DeclarationDetailProps {
	declaration: Declaration
}

export const DeclarationDetail = ({ declaration }: DeclarationDetailProps) => {
	// Obtener la definición del formulario según el tipo
	const formDefinition: IDeclarationForm | undefined =
		DECLARATION_FORMS[declaration.formType as keyof typeof DECLARATION_FORMS]

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-2 gap-4">
				<div>
					<p className="text-sm font-medium">Fecha de presentación</p>
					<p className="text-sm text-muted-foreground">
						{declaration.submittedDate ? format(new Date(declaration.submittedDate), 'dd/MM/yyyy') : 'No presentada'}
					</p>
				</div>
				<div>
					<p className="text-sm font-medium">Total a pagar</p>
					<p className="text-sm text-muted-foreground">${declaration.totalTax.toFixed(2)}</p>
				</div>
			</div>

			<Separator />

			<Card>
				<CardHeader>
					<CardTitle>Resumen de Valores</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<p className="text-sm font-medium">Ingresos totales</p>
							<p className="text-sm text-muted-foreground">${declaration.totalIncome.toFixed(2)}</p>
						</div>
						<div>
							<p className="text-sm font-medium">Gastos totales</p>
							<p className="text-sm text-muted-foreground">${declaration.totalExpenses.toFixed(2)}</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{formDefinition && (
				<div className="space-y-4">
					{formDefinition.sections.map((section) => (
						<Card key={section.title}>
							<CardHeader>
								<CardTitle>{section.title}</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									{section.fields.map((field) => (
										<div key={field.code} className="grid grid-cols-2 gap-4">
											<div>
												<p className="text-sm font-medium">
													{field.code} - {field.label}
												</p>
											</div>
											<div>
												<p className="text-sm text-right">
													{/* Aquí podríamos mostrar el valor real de cada campo si tuviéramos los datos detallados */}
													$0.00
												</p>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{!formDefinition && (
				<Card>
					<CardContent>
						<p className="text-center text-muted-foreground py-4">
							No se encontró información detallada para este tipo de formulario
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	)
}
