import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Declaration,
  DECLARATION_FORMS,
  DeclarationForm as IDeclarationForm,
  UpdateDeclarationDto,
} from './declarations.interface'
import { format } from 'date-fns'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { declarationsService } from './declarations.service'
import { toast } from 'sonner'

// Helper functions for status displays
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'submitted':
      return 'bg-green-100 text-green-800'
    case 'rejected':
      return 'bg-red-100 text-red-800'
    case 'approved':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'submitted':
      return 'Presentada'
    case 'rejected':
      return 'Errónea'
    case 'approved':
      return 'Aprobada'
    default:
      return 'Borrador'
  }
}

interface DeclarationDetailProps {
  declaration: Declaration
  onStatusUpdate?: (updatedDeclaration: Declaration) => void
}

export const DeclarationDetail = ({ declaration, onStatusUpdate }: DeclarationDetailProps) => {
  // Estado para los diálogos de confirmación
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Obtener la definición del formulario según el tipo
  const formDefinition: IDeclarationForm | undefined =
    DECLARATION_FORMS[declaration.formType as keyof typeof DECLARATION_FORMS]

  // Función para actualizar el estado de la declaración
  const updateDeclarationStatus = async (status: 'submitted' | 'rejected') => {
    try {
      setIsLoading(true)
      const updateData: UpdateDeclarationDto = {
        status,
        // Si es presentada, actualizar la fecha
        ...(status === 'submitted' && { submittedDate: new Date().toISOString() }),
      }

      const updatedDeclaration = await declarationsService.update(declaration.id, updateData)

      // Notificar éxito
      toast.success(status === 'submitted' ? 'Declaración presentada' : 'Declaración rechazada', {
        description:
          status === 'submitted'
            ? 'La declaración ha sido marcada como presentada'
            : 'La declaración ha sido marcada como rechazada',
      })

      // Notificar al componente padre
      if (onStatusUpdate) {
        onStatusUpdate(updatedDeclaration)
      }

      // Cerrar diálogos
      setIsSubmitDialogOpen(false)
      setIsRejectDialogOpen(false)
    } catch {
      toast.error('Error', {
        description: 'No se pudo actualizar el estado de la declaración',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Verificar si el status actual permite cambios
  const canUpdateStatus = declaration.status === 'draft'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="grid grid-cols-2 gap-4 flex-1">
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

        {canUpdateStatus && (
          <div className="flex gap-2">
            <Button onClick={() => setIsSubmitDialogOpen(true)} className="gap-2" disabled={isLoading}>
              <CheckCircle size={16} />
              Marcar como presentada
            </Button>
            <Button
              onClick={() => setIsRejectDialogOpen(true)}
              variant="destructive"
              className="gap-2"
              disabled={isLoading}
            >
              <AlertCircle size={16} />
              Marcar como errónea
            </Button>
          </div>
        )}

        {declaration.status !== 'draft' && (
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(declaration.status)}`}>
              {getStatusLabel(declaration.status)}
            </span>
          </div>
        )}
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
                  {section.fields.map((field) => {
                    // Find the corresponding item in declaration.items
                    const item = declaration.items.find((item) => item.code === field.code)

                    return (
                      <div key={field.code} className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">
                            {field.code} - {field.label}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-right">${item ? item.amount.toFixed(2) : '0.00'}</p>
                        </div>
                      </div>
                    )
                  })}
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

      {/* Diálogo de confirmación para presentar */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar presentación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea marcar esta declaración como presentada? Esta acción registrará la fecha actual
              como fecha de presentación.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={() => updateDeclarationStatus('submitted')} disabled={isLoading}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para marcar como errónea */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar rechazo</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea marcar esta declaración como errónea? Esto indicará que hay problemas con la
              declaración.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={() => updateDeclarationStatus('rejected')} disabled={isLoading}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
